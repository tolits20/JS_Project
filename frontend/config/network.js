const client = new URL(window.location.href)
 const config = {
    ip : "192.168.171.201",
    port : '8080',
    client:{
        host:`${client.host}`,
        port:`${client.port}`,
        hostname:`${client.hostname}`
    },

};

export default config