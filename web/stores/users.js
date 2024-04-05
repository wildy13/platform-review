import { defineStore } from 'pinia';
import slug from 'slug'
import { createAlova } from 'alova';
import GlobalFetch from 'alova/GlobalFetch';

export const useUsersStore = defineStore('users', () => {
  const config = useRuntimeConfig();
  
  const { token, data } = useAuth();
  const headers = {
    Authorization: token.value,
    'Content-Type': 'application/json;charset=UTF-8',
  };

  const alovaInstance = createAlova({
    baseURL: config.public.apiUrl,
    requestAdapter: GlobalFetch(),
    responded: {
      onSuccess: async (response) => {
        const json = await response.json();
        if (response.status !== 200) throw new Error(json.message);
        return json;
      },
    },
  });

  const items = ref([]);
  const avatar = ref(slug(data.value.user.username));

  async function getAll() {
    const res = await alovaInstance.Get('/api/users').send();
    this.items = res;

    return res;
  }

  async function create(body) {
    const res = await alovaInstance.Post('/api/users/', body, { headers }).send();
    this.items.push(res);

    return res;
  }

  async function update(body) {
    const res = await alovaInstance.Put(`/api/users/${body._id}`, body, { headers }).send();
    const index = this.items.findIndex((v) => v._id === res._id);
    Object.assign(this.items[index], res);

    return res;
  }

  async function changePassword(body) {
    console.log(body);
    const res = await alovaInstance.Put(`/api/users/changePassword/${data.value.user._id}`, body, { headers }).send();
    const index = this.items.findIndex((v) => v._id === res._id);
    Object.assign(this.items[index], res);

    return res;
  }

  async function profile(body) {
    const { imageFile } = body;
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    const res = await alovaInstance.Put(`/api/users/profile/${body._id}`, formData, { headers: { Authorization: token.value }, enableUpload: true }).send();
    this.avatar = slug(res.username);
    return res;
  }

  async function remove(body) {
    const res = await alovaInstance.Delete('/api/users/remove', body, { headers }).send();
    await Promise.all(
      res.map((v1) => {
        const index = this.items.findIndex((v2) => v2._id === v1._id);
        this.items.splice(index, 1);
        return true;
      }),
    );

    return res;
  }

  return {
    items, avatar, getAll, create, update, remove, changePassword, profile
  };
});