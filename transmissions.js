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
                    options: {
                        sandbox: true
                    },
                    content: {
                        from: 'testing@sparkpostbox.com',
                        subject: 'Hello, World!',
                        html: '<html><body><p>Testing SparkPost - the world\'s most awesomest email service!</p></body></html>'
                    },
                    recipients: [
                        { address: '<YOUR EMAIL ADDRESS>' }
                    ]
                })
                .then(data => {
                    console.log('Woohoo! You just sent your first mailing!');
                    console.log(data);
                })
                .catch(err => {
                    console.log('Whoops! Something went wrong');
                    console.log(err);
                });
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }
    RED.nodes.registerType("send-transmission",Transmissions,{
        credentials: {
            apikey: {type:"password"}
        }
    });
    
}
