"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerFromSaleCrm = exports.SendCustomerToSaleCrm = exports.SendOTPMessage = void 0;
var axios = require('axios');
const SendOTPMessage = async (message) => {
    return await new Promise(async (resolve, reject) => {
        const headers = {
            'Content-Type': 'application/json',
        };
        const data = {
            campaign_name: process.env.APPMSG_CAMPAIGNNAME,
            auth_key: process.env.APPMSG_AUTHKEY,
            receivers: message.mobile,
            sender: process.env.APPMSG_SENDER,
            route: 'TR',
            message: {
                msgdata: `Gajra Gro + Loyalty - OTP to verify your login is ${message.otp} from -GAJRA GEARS PRIVATE LIMITED`,
                Template_ID: process.env.APPMSG_TEMPLATEID,
                coding: '',
                flash_message: 1,
                scheduleTime: '',
            },
        };
        await axios.post(process.env.APPMSG_APIURL, data, { headers }).then((response) => {
            const { data } = response;
            if (data.status === 'Success') {
                resolve(data);
            }
            else {
                reject(response);
            }
        })
            .catch((error) => {
            reject(error);
        });
    });
};
exports.SendOTPMessage = SendOTPMessage;
const SendCustomerToSaleCrm = (data) => {
    axios.get('http://15.207.254.162/api/getStateList', data)
        .then((response) => {
        console.log('res', response);
    })
        .catch((error) => {
        console.log('erro', error);
    });
};
exports.SendCustomerToSaleCrm = SendCustomerToSaleCrm;
const getCustomerFromSaleCrm = () => {
    const promise = new Promise((resolve, reject) => {
        axios.get('http://gajragears.greymetre.io/api/signupFromGajraMlp')
            .then((response) => {
            resolve(response.data);
        })
            .catch((error) => {
            reject(error);
        });
    });
};
exports.getCustomerFromSaleCrm = getCustomerFromSaleCrm;
//# sourceMappingURL=send.message.js.map