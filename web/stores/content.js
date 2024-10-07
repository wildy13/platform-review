import { defineStore } from 'pinia';
import { createAlova } from 'alova';
import GlobalFetch from 'alova/GlobalFetch';

export const useContentStore = defineStore('content', () => {
  const config = useRuntimeConfig();
  const { data } = useAuth();
  const { token } = useAuth();
  const { socket } = useSocket();
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

  async function getAll() {
    const res = await alovaInstance.Get('/api/content').send();
    this.items = res;

    return res;
  }

  async function upload (body) {
    const {
      contentZip, ...rest
    } = body;

    const formData = new FormData();
    formData.append('data', JSON.stringify(rest));
    formData.append('content', contentZip);
    const res = await alovaInstance.Post('/api/content/upload', formData, {
      headers: {
        Authorization: token.value,
      },
      enableUpload: true,
    }).send();
    this.items.push(res);

    return res;
  }
  async function create(body) {
    const res = await alovaInstance.Post('/api/content/', body, { headers }).send();
    socket.emit('logs-content:create', body, data.value.user);
    this.items.push(res);

    return res;
  }

  async function update(body) {
    const {
      contentZip, ...rest
    } = body;
    const formData = new FormData();
    formData.append('data', JSON.stringify(rest));
    formData.append('content', contentZip);

    const res = await alovaInstance.Put('/api/content/', formData, {
      headers: {
        Authorization: token.value,
      },
      enableUpload: true,
    }).send();
    socket.emit('logs-content:update', rest, data.value.user);
    const index = this.items.findIndex((v) => v._id === res._id);
    Object.assign(this.items[index], res);

    return res;
  }

  async function remove(body) {
    const res = await alovaInstance.Delete('/api/content/remove', body, { headers }).send();
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
    items, getAll, create, update, remove,upload
  };
});