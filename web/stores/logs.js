import { defineStore } from 'pinia';

export const useLogStore = defineStore('log', () => {

    const { socket } = useSocket();
    const logs = ref([]);

    async function getAll() {
        socket.on('connect', () => {
            socket.emit('logs-project:list', async(res) => {
                this.logs = res.data;
            });

            socket.on('logs-project:create', async(res) => {
                this.logs.push(res);
            });

            socket.on('logs-module:create', async(res) => {
                this.logs.push(res);
            });

            socket.on('logs-content:create', async(res) => {
                this.logs.push(res);
            });
        })
    }

    return {
        logs, getAll,
    };
});