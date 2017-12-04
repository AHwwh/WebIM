var encrypt = require('encrypt.js');

var sdkappid = 10001;

var loginInfo = wx.getStorageSync('loginInfo')

    function anologin(cb) {
        if (loginInfo != '未登录') {
            login({
                TmpSig: loginInfo.TmpSig,
                Identifier: loginInfo.Identifier,
                success: cb
            })
        } else {
            wx.request({
                url: 'https://tls.qcloud.com/anologin', //仅为示例，并非真实的接口地址
                data: {
                    "passwd": encrypt.getRSAH1(),
                    "url": 'https://tls.qcloud.com/demo.html',
                    "sdkappid": sdkappid
                },
                method: 'GET',
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    //console.info(res)
                    var matches = res.data.match(/tlsAnoLogin\((.*?)\)/);
                    var params = JSON.parse(matches[1]);
                    var loginData = {
                        TmpSig: params.TmpSig,
                        Identifier: params.Identifier,
                        success: cb
                    };

                    wx.setStorageSync('loginInfo', loginData)
                    login(loginData)
                }
            });
        }

    }

    function login(opts) {
        wx.request({
            url: 'https://tls.qcloud.com/getusersig', //仅为示例，并非真实的接口地址
            data: {
                "tmpsig": opts.TmpSig,
                "identifier": opts.Identifier,
                "sdkappid": sdkappid
            },
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                var matches = res.data.match(/tlsGetUserSig\((.*?)\)/);
                var UserSig = JSON.parse(matches[1])['UserSig'];
                opts.success && opts.success({
                    Identifier: opts.Identifier,
                    UserSig: UserSig
                });
            },
            fail: function(errMsg) {
                opts.error && opts.error(errMsg);
            }
        });
    }

module.exports = {
    init: function(opts) {
        sdkappid = opts.sdkappid;
    },
    anologin: anologin,
    login: login
};