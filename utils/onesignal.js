const https = require('https');

const headers = {
    "Content-Type": "application/json; charset=utf-8",
};

const options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
};

const message = {};

/**
 * @param { { message: string, onesignal_id: [string]  } } data
 * @param { { (err: any, response: any) => void } } cb
 * @return cb
 */
const notifyUser = (data, cb) => {
    message['contents'] = { 'es': data.message, 'en': data.message };
    message['include_player_ids'] = data.onesignal_id;

    console.log('notifyUser:message', message);

    const req = https.request(options, (res) => {
        res.setEncoding('utf8');

        res.on('data', (recivedData) => {
            cb(null, recivedData);
        });
    });

    req.on('error', (err) => {
        cb(err, null);
    });

    req.write(JSON.stringify(message));
    req.end();
};

/** 
 * @param { string } auth_key
 * @param { string } app_id
 */
function configure(auth_key, app_id) {
    headers['Authorization'] = 'Basic ' + auth_key;
    message['app_id'] = app_id;
}

module.exports = (auth_key, app_id) => {
    configure(auth_key, app_id);
    return {
        notifyUser
    };
}
