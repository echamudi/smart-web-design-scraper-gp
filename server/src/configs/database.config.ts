let host: string;
let port: number;

if (process.env.DOCKER_CONTAINER) {
    host = "mongo";
    port = 27017;
} else {
    host = "localhost"
    port = 3002;
}

export default {
    HOST: host,
    PORT: port,
    DB: 'swdsdb',
};
