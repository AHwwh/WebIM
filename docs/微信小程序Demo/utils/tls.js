var encrypt = require('encrypt.js');

var sdkappid = 10001;
function anologin(cb){
      wx.request({
            url: 'https://tls.qcloud.com/anologin', //仅为示例，并非真实的接口地址
            data: {
                "passwd": encrypt.getRSAH1(),
                "url": 'https://tls.qcloud.com/demo.html',
                "sdkappid": sdkappid
            },
            method: 'POST',
            header: {
                // 'content-type': 'application/json'
            },
            success: function(res) {
                var matches = res.data.match(/tlsAnoLogin\((.*?)\)/);
                var params = JSON.parse(matches[1]);
                login({
                    TmpSig : params.TmpSig,
                    Identifier: params.Identifier,
                    success : cb
                })
            }
        });
}



function login(opts){
  var user = "user" + parseInt(Math.random(0, 1) * 1000000) ;
    wx.request({
      url: 'https://sxb.qcloud.com/sxb_dev/?svc=doll&cmd=fetchsig', //仅为示例，并非真实的接口地址
        data: {
          "id": user,
            "appid": sdkappid
        },
        method: 'post',
        header: {
             'content-type': 'application/json'
        },
        success: function(res) {
            opts.success && opts.success({
              Identifier: user,
                UserSig: res.data.data.userSig
            });
        },
        fail : function(errMsg){
            opts.error && opts.error(errMsg);
        }
    });
}

module.exports = {
    init : function(opts){
        sdkappid = opts.sdkappid;
    },
    anologin : anologin,
    login : login
};