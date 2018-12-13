
module.exports = function(RED) {
    "use strict";

    function Subaccounts(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.debug("config= \n" + JSON.stringify(config, null, 2));

        node.on('input', function(msg) {
            node.debug("msg= \n" + JSON.stringify(msg, null, 2));

            this.sparkpostKey = msg.topic;
            var SparkPost = require('sparkpost');
            if(!this.sparkpostKey) {
                var key_err_msg = "Sparkpost: Missing Sparkpost credentials";
                node.error(key_err_msg);
                node.send([ { payload: null }, { payload: key_err_msg } ]);
                return;
            }
            var client = new SparkPost(this.sparkpostKey);

            // {"verb":"GET","id":""}
            this.verb = msg.payload.verb.toLowerCase();
            this.id = msg.payload.id;
            node.log("verb: " + this.verb);
            if(!this.verb) {
                var verb_err_msg = "Sparkpost: Missing HTTP verb (GET, POST, UPDATE)";
                node.error(verb_err_msg);
                node.send([ { payload: null }, { payload: verb_err_msg } ]);
                return;
            }

            // LIST ALL SUBACCOUNTS
            if(this.verb === "get" && !this.id) {
                client.subaccounts.list()
                    .then(data => {
                        node.log('Sparkpost: Subaccounts GET:' + JSON.stringify(data, null, 2));
                        node.send([{payload: data}, {payload: null}]);
                    })
                    .catch(err => {
                        node.error("Sparkpost: Whoops! Something went wrong with Subaccounts GET: " + err);
                        node.send([{payload: null}, {payload: err}]);
                    });
            }

            // LIST SPECIFIC SUBACCOUNT BY ID
            else if(this.verb === "get" && this.id) {
                node.debug("ID= " + this.id);
                if(typeof this.id != "string") {
                    var id_err_msg = "Sparkpost: ID number must be a string (not number)";
                    node.error(id_err_msg);
                    node.send([ { payload: null }, { payload: id_err_msg } ]);
                    return;
                }
                client.subaccounts.get(this.id)
                    .then(data => {
                        node.log('Sparkpost: Subaccounts GET ID:' + JSON.stringify(data, null, 2));
                        node.send([{payload: data}, {payload: null}]);
                    })
                    .catch(err => {
                        node.error("Sparkpost: Whoops! Something went wrong with Subaccounts GET ID: " + err);
                        node.send([{payload: null}, {payload: err}]);
                    });
            }

            else {
                var fall_thru_err_msg = "Sparkpost: Inputs/payload failed to trigger any conditions. msg= \n" +
                    JSON.stringify(msg.payload, null, 2);
                node.error(fall_thru_err_msg);
                node.send([ { payload: null }, { payload: fall_thru_err_msg } ]);
            }
        });
    }
    RED.nodes.registerType("subaccounts",Subaccounts);
};
