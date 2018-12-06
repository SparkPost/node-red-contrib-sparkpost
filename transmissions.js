const SparkPost = require('sparkpost');
const config = require('config');

const client = new SparkPost('<YOUR API KEY>');

module.exports = function(RED) {
    function Transmissions(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
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
    RED.nodes.registerType("send-transmission",Transmissions);
}
