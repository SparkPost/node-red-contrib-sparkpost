const SparkPost = require('sparkpost');
const config = require('config');

module.exports = function(RED) {
    function Transmissions(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        const apiKey = this.credentials.apikey;
        node.on('input', function(msg) {
            const client = new SparkPost(apiKey);

            client.transmissions.send({
                    content: {
                        from: msg.from,
                        subject: msg.topic,
                        html: msg.payload.html,
                        text: msg.payload.text
                    },
                    recipients: [
                        { address: msg.to }
                    ]
                })
                .then(data => {
                    console.log(data);
                })
                .catch(err => {
                    console.log('Whoops! Something went wrong');
                    console.log(err);
                });
            node.send(msg);
        });
    }
    RED.nodes.registerType("send-transmission",Transmissions,{
        credentials: {
            apikey: {type:"password"}
        }
    });
    
}
