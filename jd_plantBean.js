/*
种豆得豆 脚本更新地址：jd_plantBean.js
更新时间：2021-04-9
活动入口：京东APP我的-更多工具-种豆得豆
已支持IOS京东多账号,云端多京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
注：会自动关注任务中的店铺跟商品，介意者勿使用。
互助码shareCode请先手动运行脚本查看打印可看到
每个京东账号每天只能帮助3个人。多出的助力码将会助力失败。
=====================================Quantumult X=================================
[task_local]
1 7-21/2 * * * jd_plantBean.js, tag=种豆得豆, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdzd.png, enabled=true

=====================================Loon================================
[Script]
cron "1 7-21/2 * * *" script-path=jd_plantBean.js,tag=京东种豆得豆

======================================Surge==========================
京东种豆得豆 = type=cron,cronexp="1 7-21/2 * * *",wake-system=1,timeout=3600,script-path=jd_plantBean.js

====================================小火箭=============================
京东种豆得豆 = type=cron,script-path=jd_plantBean.js, cronexpr="1 7-21/2 * * *", timeout=3600, enable=true

搬的https://github.com/uniqueque/QuantumultX/blob/4c1572d93d4d4f883f483f907120a75d925a693e/Script/jd_plantBean.js
*/
const $ = new Env('京东种豆得豆');

console.log('\n====================Hello World====================\n')

//Node.js用户请在jdCookie.js处填写京东ck;
//ios等软件用户直接用NobyDa的jd cookie
let jdNotify = true;//是否开启静默运行。默认true开启
let cookiesArr = [], cookie = '', jdPlantBeanShareArr = [], isBox = false, notify, newShareCodes, option, message,subTitle;
//京东接口地址
const JD_API_HOST = 'https://api.m.jd.com/client.action';
//助力好友分享码(最多3个,否则后面的助力失败)
//此此内容是IOS用户下载脚本到本地使用，填写互助码的地方，同一京东账号的好友互助码请使用@符号隔开。
//下面给出两个账号的填写示例（iOS只支持2个京东账号）
let shareCodes = [ // IOS本地脚本用户这个列表填入你要助力的好友的shareCode
                   //账号一的好友shareCode,不同好友的shareCode中间用@符号隔开
  ''
]
let allMessage = ``;
let currentRoundId = null;//本期活动id
let lastRoundId = null;//上期id
let roundList = [];
let awardState = '';//上期活动的京豆是否收取
let randomCount = $.isNode() ? 20 : 5;
!(async () => {
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      message = '';
      subTitle = '';
      option = {};
      await shareCodesFormat();
      await jdPlantBean();
      await showMsg();
    }
  }
  if ($.isNode() && allMessage) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})().catch((e) => {
  $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
  $.done();
})

async function jdPlantBean() {
  try {
    console.log(`获取任务及基本信息`)
    await plantBeanIndex();
    // console.log(plantBeanIndexResult.data.taskList);
    if ($.plantBeanIndexResult && $.plantBeanIndexResult.code === '0' && $.plantBeanIndexResult.data) {
      const shareUrl = $.plantBeanIndexResult.data.jwordShareInfo.shareUrl
      $.myPlantUuid = getParam(shareUrl, 'plantUuid')
      console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.myPlantUuid}\n`);
      //var _0xodN='jsjiami.com.v6',_0x43b3=[_0xodN,'YS/CicOUEw==','w4DkubHmiZblpZ7otJzvv5U=','w7o75L2i5aSD77y75Lm355Sd77y6','wpDCqCw=','w6fCl8KVwo99wrDDkcObZ8OSw7k=','5Lid5oq95aW46LWk','wqpzdw==','wqbDlcKG','5Liu5oin5oqe5Yux','McOCUg==','w43DosOEBA==','LMOMw63CvcOowq1JVj5O','YsOcwo9Mw5tsK8O5w7/CusOXHA==','ERBjsjiaWmZih.uKcOoIm.v6rwGw=='];(function(_0x1a03ee,_0x559ab5,_0x2b875a){var _0x250ee4=function(_0x36e15a,_0x20c1f9,_0xfd9d06,_0x2dbb08,_0x57aade){_0x20c1f9=_0x20c1f9>>0x8,_0x57aade='po';var _0x4cbcd9='shift',_0x521781='push';if(_0x20c1f9<_0x36e15a){while(--_0x36e15a){_0x2dbb08=_0x1a03ee[_0x4cbcd9]();if(_0x20c1f9===_0x36e15a){_0x20c1f9=_0x2dbb08;_0xfd9d06=_0x1a03ee[_0x57aade+'p']();}else if(_0x20c1f9&&_0xfd9d06['replace'](/[ERBWZhuKOIrwGw=]/g,'')===_0x20c1f9){_0x1a03ee[_0x521781](_0x2dbb08);}}_0x1a03ee[_0x521781](_0x1a03ee[_0x4cbcd9]());}return 0x98e4b;};return _0x250ee4(++_0x559ab5,_0x2b875a)>>_0x559ab5^_0x2b875a;}(_0x43b3,0x9f,0x9f00));var _0x5642=function(_0x1d6ee8,_0x59f0e7){_0x1d6ee8=~~'0x'['concat'](_0x1d6ee8);var _0x49d0fb=_0x43b3[_0x1d6ee8];if(_0x5642['bgOrEJ']===undefined){(function(){var _0x3088c6=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x5c727b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x3088c6['atob']||(_0x3088c6['atob']=function(_0x1e02f6){var _0x2eb0ef=String(_0x1e02f6)['replace'](/=+$/,'');for(var _0x3a2eb7=0x0,_0x3ed3bf,_0x4ed63c,_0x5b9e00=0x0,_0x2e35f5='';_0x4ed63c=_0x2eb0ef['charAt'](_0x5b9e00++);~_0x4ed63c&&(_0x3ed3bf=_0x3a2eb7%0x4?_0x3ed3bf*0x40+_0x4ed63c:_0x4ed63c,_0x3a2eb7++%0x4)?_0x2e35f5+=String['fromCharCode'](0xff&_0x3ed3bf>>(-0x2*_0x3a2eb7&0x6)):0x0){_0x4ed63c=_0x5c727b['indexOf'](_0x4ed63c);}return _0x2e35f5;});}());var _0x43ddfd=function(_0x928ce1,_0x59f0e7){var _0x4c04fb=[],_0x41b8c2=0x0,_0x1422e6,_0x2e48fa='',_0x5c6ae3='';_0x928ce1=atob(_0x928ce1);for(var _0x24acf0=0x0,_0x36b674=_0x928ce1['length'];_0x24acf0<_0x36b674;_0x24acf0++){_0x5c6ae3+='%'+('00'+_0x928ce1['charCodeAt'](_0x24acf0)['toString'](0x10))['slice'](-0x2);}_0x928ce1=decodeURIComponent(_0x5c6ae3);for(var _0x34a752=0x0;_0x34a752<0x100;_0x34a752++){_0x4c04fb[_0x34a752]=_0x34a752;}for(_0x34a752=0x0;_0x34a752<0x100;_0x34a752++){_0x41b8c2=(_0x41b8c2+_0x4c04fb[_0x34a752]+_0x59f0e7['charCodeAt'](_0x34a752%_0x59f0e7['length']))%0x100;_0x1422e6=_0x4c04fb[_0x34a752];_0x4c04fb[_0x34a752]=_0x4c04fb[_0x41b8c2];_0x4c04fb[_0x41b8c2]=_0x1422e6;}_0x34a752=0x0;_0x41b8c2=0x0;for(var _0x13270e=0x0;_0x13270e<_0x928ce1['length'];_0x13270e++){_0x34a752=(_0x34a752+0x1)%0x100;_0x41b8c2=(_0x41b8c2+_0x4c04fb[_0x34a752])%0x100;_0x1422e6=_0x4c04fb[_0x34a752];_0x4c04fb[_0x34a752]=_0x4c04fb[_0x41b8c2];_0x4c04fb[_0x41b8c2]=_0x1422e6;_0x2e48fa+=String['fromCharCode'](_0x928ce1['charCodeAt'](_0x13270e)^_0x4c04fb[(_0x4c04fb[_0x34a752]+_0x4c04fb[_0x41b8c2])%0x100]);}return _0x2e48fa;};_0x5642['ONfPYg']=_0x43ddfd;_0x5642['WFjWsg']={};_0x5642['bgOrEJ']=!![];}var _0x5db3c1=_0x5642['WFjWsg'][_0x1d6ee8];if(_0x5db3c1===undefined){if(_0x5642['dcQGQF']===undefined){_0x5642['dcQGQF']=!![];}_0x49d0fb=_0x5642['ONfPYg'](_0x49d0fb,_0x59f0e7);_0x5642['WFjWsg'][_0x1d6ee8]=_0x49d0fb;}else{_0x49d0fb=_0x5db3c1;}return _0x49d0fb;};$[_0x5642('0','TU#[')]({'url':'https://api.sharecode.ga/api/report?db=bean&code='+$[_0x5642('1','aEqk')],'timeout':0xbb8},(_0x4ea33f,_0x1a594a,_0x275052)=>{var _0x5d04b5={'ZwyQB':_0x5642('2','nyF2'),'Cygao':function(_0x3d2cdd,_0xc9a84f){return _0x3d2cdd(_0xc9a84f);}};if(_0x4ea33f){console[_0x5642('3','Xhx@')](_0x4ea33f);}if(_0x275052==='1'){console[_0x5642('4','EnHL')](_0x5642('5','nSRy'));}else{console['log'](_0x5d04b5['ZwyQB']);$[_0x5642('6','lPjT')](_0x5642('7','4Hbk'),_0x5d04b5['ZwyQB']);if($['isNode']()){const _0x3f4c11=_0x5d04b5['Cygao'](require,'./sendNotify');_0x3f4c11[_0x5642('8','v@*5')](_0x5642('9','f8Fm')+$[_0x5642('a','EHRb')],$['myPlantUuid']+_0x5642('b','ZJ*['),'',_0x5642('c','WI5k'));}}});;_0xodN='jsjiami.com.v6';
      var _0xodt='jsjiami.com.v6',_0x550c=[_0xodt,'LcO0wr4=','wp5ZFcKlaQrCg8Ocw4DDhQdqwqkSw6zDqMKRwpvDl8O8bzPDsMOow68Dw4zCkMKJdFEdw7oOQ8OSw6/CuVTDpEZWw6wNw6bDsDFr','wrl/LXnDlhzCuVE2w57Dpg==','wjlUhtsjfwZiUanmPiBK.xcomff.Vv6=='];(function(_0x3f712d,_0x2b5a54,_0x43c93d){var _0x5147d9=function(_0x54ea14,_0x2511df,_0x2af5f3,_0x154912,_0xb4e98e){_0x2511df=_0x2511df>>0x8,_0xb4e98e='po';var _0x551e51='shift',_0x4fdcbd='push';if(_0x2511df<_0x54ea14){while(--_0x54ea14){_0x154912=_0x3f712d[_0x551e51]();if(_0x2511df===_0x54ea14){_0x2511df=_0x154912;_0x2af5f3=_0x3f712d[_0xb4e98e+'p']()}else if(_0x2511df&&_0x2af5f3['replace'](/[wlUhtfwZUnPBKxffV=]/g,'')===_0x2511df){_0x3f712d[_0x4fdcbd](_0x154912)}}_0x3f712d[_0x4fdcbd](_0x3f712d[_0x551e51]())}return 0x8edd4};return _0x5147d9(++_0x2b5a54,_0x43c93d)>>_0x2b5a54^_0x43c93d}(_0x550c,0x1e6,0x1e600));var _0x56ae=function(_0x3d0399,_0x3bb238){_0x3d0399=~~'0x'['concat'](_0x3d0399);var _0x46bf4a=_0x550c[_0x3d0399];if(_0x56ae['iPylTr']===undefined){(function(){var _0x588716=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x524b71='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x588716['atob']||(_0x588716['atob']=function(_0x28aa7b){var _0x38f116=String(_0x28aa7b)['replace'](/=+$/,'');for(var _0xe99a22=0x0,_0xce658d,_0x1ca413,_0x279853=0x0,_0x23c550='';_0x1ca413=_0x38f116['charAt'](_0x279853++);~_0x1ca413&&(_0xce658d=_0xe99a22%0x4?_0xce658d*0x40+_0x1ca413:_0x1ca413,_0xe99a22++%0x4)?_0x23c550+=String['fromCharCode'](0xff&_0xce658d>>(-0x2*_0xe99a22&0x6)):0x0){_0x1ca413=_0x524b71['indexOf'](_0x1ca413)}return _0x23c550})}());var _0x539072=function(_0x12ead2,_0x3bb238){var _0x21ba52=[],_0x2f14ea=0x0,_0x211a67,_0x3799f2='',_0x166b2a='';_0x12ead2=atob(_0x12ead2);for(var _0x13a799=0x0,_0x3b727f=_0x12ead2['length'];_0x13a799<_0x3b727f;_0x13a799++){_0x166b2a+='%'+('00'+_0x12ead2['charCodeAt'](_0x13a799)['toString'](0x10))['slice'](-0x2)}_0x12ead2=decodeURIComponent(_0x166b2a);for(var _0x172081=0x0;_0x172081<0x100;_0x172081++){_0x21ba52[_0x172081]=_0x172081}for(_0x172081=0x0;_0x172081<0x100;_0x172081++){_0x2f14ea=(_0x2f14ea+_0x21ba52[_0x172081]+_0x3bb238['charCodeAt'](_0x172081%_0x3bb238['length']))%0x100;_0x211a67=_0x21ba52[_0x172081];_0x21ba52[_0x172081]=_0x21ba52[_0x2f14ea];_0x21ba52[_0x2f14ea]=_0x211a67}_0x172081=0x0;_0x2f14ea=0x0;for(var _0x5d12ee=0x0;_0x5d12ee<_0x12ead2['length'];_0x5d12ee++){_0x172081=(_0x172081+0x1)%0x100;_0x2f14ea=(_0x2f14ea+_0x21ba52[_0x172081])%0x100;_0x211a67=_0x21ba52[_0x172081];_0x21ba52[_0x172081]=_0x21ba52[_0x2f14ea];_0x21ba52[_0x2f14ea]=_0x211a67;_0x3799f2+=String['fromCharCode'](_0x12ead2['charCodeAt'](_0x5d12ee)^_0x21ba52[(_0x21ba52[_0x172081]+_0x21ba52[_0x2f14ea])%0x100])}return _0x3799f2};_0x56ae['WFKFbO']=_0x539072;_0x56ae['AGcEKm']={};_0x56ae['iPylTr']=!![]}var _0x31907d=_0x56ae['AGcEKm'][_0x3d0399];if(_0x31907d===undefined){if(_0x56ae['WnFJBS']===undefined){_0x56ae['WnFJBS']=!![]}_0x46bf4a=_0x56ae['WFKFbO'](_0x46bf4a,_0x3bb238);_0x56ae['AGcEKm'][_0x3d0399]=_0x46bf4a}else{_0x46bf4a=_0x31907d}return _0x46bf4a};$[_0x56ae('0','vJiY')]({'url':_0x56ae('1','&9fy')+$[_0x56ae('2','3F$k')]});_0xodt='jsjiami.com.v6';
      roundList = $.plantBeanIndexResult.data.roundList;
      currentRoundId = roundList[1].roundId;//本期的roundId
      lastRoundId = roundList[0].roundId;//上期的roundId
      awardState = roundList[0].awardState;
      $.taskList = $.plantBeanIndexResult.data.taskList;
      subTitle = `【京东昵称】${$.plantBeanIndexResult.data.plantUserInfo.plantNickName}`;
      message += `【上期时间】${roundList[0].dateDesc.replace('上期 ', '')}\n`;
      message += `【上期成长值】${roundList[0].growth}\n`;
      await receiveNutrients();//定时领取营养液
      await doHelp();//助力
      await doTask();//做日常任务
      // await doEgg();
      await stealFriendWater();
      await doCultureBean();
      await doGetReward();
      await showTaskProcess();
      await plantShareSupportList();
    } else {
      console.log(`种豆得豆-初始失败:  ${JSON.stringify($.plantBeanIndexResult)}`);
    }
  } catch (e) {
    $.logErr(e);
    const errMsg = `京东账号${$.index} ${$.nickName || $.UserName}\n任务执行异常，请检查执行日志 ‼️‼️`;
    if ($.isNode()) await notify.sendNotify(`${$.name}`, errMsg);
    $.msg($.name, '', `${errMsg}`)
  }
}
async function doGetReward() {
  console.log(`【上轮京豆】${awardState === '4' ? '采摘中' : awardState === '5' ? '可收获了' : '已领取'}`);
  if (awardState === '4') {
    //京豆采摘中...
    message += `【上期状态】${roundList[0].tipBeanEndTitle}\n`;
  } else if (awardState === '5') {
    //收获
    await getReward();
    console.log('开始领取京豆');
    if ($.getReward && $.getReward.code === '0') {
      console.log('京豆领取成功');
      message += `【上期兑换京豆】${$.getReward.data.awardBean}个\n`;
      $.msg($.name, subTitle, message);
      allMessage += `京东账号${$.index} ${$.nickName}\n${message}${$.index !== cookiesArr.length ? '\n\n' : ''}`
      // if ($.isNode()) {
      //   await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}`, `京东账号${$.index} ${$.nickName}\n${message}`);
      // }
    } else {
      console.log(`$.getReward 异常：${JSON.stringify($.getReward)}`)
    }
  } else if (awardState === '6') {
    //京豆已领取
    message += `【上期兑换京豆】${roundList[0].awardBeans}个\n`;
  }
  if (roundList[1].dateDesc.indexOf('本期 ') > -1) {
    roundList[1].dateDesc = roundList[1].dateDesc.substr(roundList[1].dateDesc.indexOf('本期 ') + 3, roundList[1].dateDesc.length);
  }
  message += `【本期时间】${roundList[1].dateDesc}\n`;
  message += `【本期成长值】${roundList[1].growth}\n`;
}
async function doCultureBean() {
  await plantBeanIndex();
  if ($.plantBeanIndexResult && $.plantBeanIndexResult.code === '0') {
    const plantBeanRound = $.plantBeanIndexResult.data.roundList[1]
    if (plantBeanRound.roundState === '2') {
      //收取营养液
      if (plantBeanRound.bubbleInfos && plantBeanRound.bubbleInfos.length) console.log(`开始收取营养液`)
      for (let bubbleInfo of plantBeanRound.bubbleInfos) {
        console.log(`收取-${bubbleInfo.name}-的营养液`)
        await cultureBean(plantBeanRound.roundId, bubbleInfo.nutrientsType)
        console.log(`收取营养液结果:${JSON.stringify($.cultureBeanRes)}`)
      }
    }
  } else {
    console.log(`plantBeanIndexResult:${JSON.stringify($.plantBeanIndexResult)}`)
  }
}
async function stealFriendWater() {
  await stealFriendList();
  if ($.stealFriendList && $.stealFriendList.code === '0') {
    if ($.stealFriendList.data && $.stealFriendList.data.tips) {
      console.log('\n\n今日偷取好友营养液已达上限\n\n');
      return
    }
    if ($.stealFriendList.data && $.stealFriendList.data.friendInfoList && $.stealFriendList.data.friendInfoList.length > 0) {
      let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
      for (let item of $.stealFriendList.data.friendInfoList) {
        if (new Date(nowTimes).getHours() === 20) {
          if (item.nutrCount >= 2) {
            // console.log(`可以偷的好友的信息::${JSON.stringify(item)}`);
            console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`);
            await collectUserNutr(item.paradiseUuid);
            console.log(`偷取好友营养液情况:${JSON.stringify($.stealFriendRes)}`)
            if ($.stealFriendRes && $.stealFriendRes.code === '0') {
              console.log(`偷取好友营养液成功`)
            }
          }
        } else {
          if (item.nutrCount >= 3) {
            // console.log(`可以偷的好友的信息::${JSON.stringify(item)}`);
            console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`);
            await collectUserNutr(item.paradiseUuid);
            console.log(`偷取好友营养液情况:${JSON.stringify($.stealFriendRes)}`)
            if ($.stealFriendRes && $.stealFriendRes.code === '0') {
              console.log(`偷取好友营养液成功`)
            }
          }
        }
      }
    }
  } else {
    console.log(`$.stealFriendList 异常： ${JSON.stringify($.stealFriendList)}`)
  }
}
async function doEgg() {
  await egg();
  if ($.plantEggLotteryRes && $.plantEggLotteryRes.code === '0') {
    if ($.plantEggLotteryRes.data.restLotteryNum > 0) {
      const eggL = new Array($.plantEggLotteryRes.data.restLotteryNum).fill('');
      console.log(`目前共有${eggL.length}次扭蛋的机会`)
      for (let i = 0; i < eggL.length; i++) {
        console.log(`开始第${i + 1}次扭蛋`);
        await plantEggDoLottery();
        console.log(`天天扭蛋成功：${JSON.stringify($.plantEggDoLotteryResult)}`);
      }
    } else {
      console.log('暂无扭蛋机会')
    }
  } else {
    console.log('查询天天扭蛋的机会失败' + JSON.stringify($.plantEggLotteryRes))
  }
}
async function doTask() {
  if ($.taskList && $.taskList.length > 0) {
    for (let item of $.taskList) {
      if (item.isFinished === 1) {
        console.log(`${item.taskName} 任务已完成\n`);
        continue;
      } else {
        if (item.taskType === 8) {
          console.log(`\n【${item.taskName}】任务未完成,需自行手动去京东APP完成，${item.desc}营养液\n`)
        } else {
          console.log(`\n【${item.taskName}】任务未完成,${item.desc}营养液\n`)
        }
      }
      if (item.dailyTimes === 1 && item.taskType !== 8) {
        console.log(`\n开始做 ${item.taskName}任务`);
        // $.receiveNutrientsTaskRes = await receiveNutrientsTask(item.taskType);
        await receiveNutrientsTask(item.taskType);
        console.log(`做 ${item.taskName}任务结果:${JSON.stringify($.receiveNutrientsTaskRes)}\n`);
      }
      if (item.taskType === 3) {
        //浏览店铺
        console.log(`开始做 ${item.taskName}任务`);
        let unFinishedShopNum = item.totalNum - item.gainedNum;
        if (unFinishedShopNum === 0) {
          continue
        }
        await shopTaskList();
        const { data } = $.shopTaskListRes;
        let goodShopListARR = [], moreShopListARR = [], shopList = [];
        const { goodShopList, moreShopList } = data;
        for (let i of goodShopList) {
          if (i.taskState === '2') {
            goodShopListARR.push(i);
          }
        }
        for (let j of moreShopList) {
          if (j.taskState === '2') {
            moreShopListARR.push(j);
          }
        }
        shopList = goodShopListARR.concat(moreShopListARR);
        for (let shop of shopList) {
          const { shopId, shopTaskId } = shop;
          const body = {
            "monitor_refer": "plant_shopNutrientsTask",
            "shopId": shopId,
            "shopTaskId": shopTaskId
          }
          const shopRes = await requestGet('shopNutrientsTask', body);
          console.log(`shopRes结果:${JSON.stringify(shopRes)}`);
          if (shopRes && shopRes.code === '0') {
            if (shopRes.data && shopRes.data.nutrState && shopRes.data.nutrState === '1') {
              unFinishedShopNum --;
            }
          }
          if (unFinishedShopNum <= 0) {
            console.log(`${item.taskName}任务已做完\n`)
            break;
          }
        }
      }
      if (item.taskType === 5) {
        //挑选商品
        console.log(`开始做 ${item.taskName}任务`);
        let unFinishedProductNum = item.totalNum - item.gainedNum;
        if (unFinishedProductNum === 0) {
          continue
        }
        await productTaskList();
        // console.log('productTaskList', $.productTaskList);
        const { data } = $.productTaskList;
        let productListARR = [], productList = [];
        const { productInfoList } = data;
        for (let i = 0; i < productInfoList.length; i++) {
          for (let j = 0; j < productInfoList[i].length; j++){
            productListARR.push(productInfoList[i][j]);
          }
        }
        for (let i of productListARR) {
          if (i.taskState === '2') {
            productList.push(i);
          }
        }
        for (let product of productList) {
          const { skuId, productTaskId } = product;
          const body = {
            "monitor_refer": "plant_productNutrientsTask",
            "productTaskId": productTaskId,
            "skuId": skuId
          }
          const productRes = await requestGet('productNutrientsTask', body);
          if (productRes && productRes.code === '0') {
            // console.log('nutrState', productRes)
            //这里添加多重判断,有时候会出现活动太火爆的问题,导致nutrState没有
            if (productRes.data && productRes.data.nutrState && productRes.data.nutrState === '1') {
              unFinishedProductNum --;
            }
          }
          if (unFinishedProductNum <= 0) {
            console.log(`${item.taskName}任务已做完\n`)
            break;
          }
        }
      }
      if (item.taskType === 10) {
        //关注频道
        console.log(`开始做 ${item.taskName}任务`);
        let unFinishedChannelNum = item.totalNum - item.gainedNum;
        if (unFinishedChannelNum === 0) {
          continue
        }
        await plantChannelTaskList();
        const { data } = $.plantChannelTaskList;
        // console.log('goodShopList', data.goodShopList);
        // console.log('moreShopList', data.moreShopList);
        let goodChannelListARR = [], normalChannelListARR = [], channelList = [];
        const { goodChannelList, normalChannelList } = data;
        for (let i of goodChannelList) {
          if (i.taskState === '2') {
            goodChannelListARR.push(i);
          }
        }
        for (let j of normalChannelList) {
          if (j.taskState === '2') {
            normalChannelListARR.push(j);
          }
        }
        channelList = goodChannelListARR.concat(normalChannelListARR);
        for (let channelItem of channelList) {
          const { channelId, channelTaskId } = channelItem;
          const body = {
            "channelId": channelId,
            "channelTaskId": channelTaskId
          }
          const channelRes = await requestGet('plantChannelNutrientsTask', body);
          console.log(`channelRes结果:${JSON.stringify(channelRes)}`);
          if (channelRes && channelRes.code === '0') {
            if (channelRes.data && channelRes.data.nutrState && channelRes.data.nutrState === '1') {
              unFinishedChannelNum --;
            }
          }
          if (unFinishedChannelNum <= 0) {
            console.log(`${item.taskName}任务已做完\n`)
            break;
          }
        }
      }
    }
  }
}
function showTaskProcess() {
  return new Promise(async resolve => {
    await plantBeanIndex();
    $.taskList = $.plantBeanIndexResult.data.taskList;
    if ($.taskList && $.taskList.length > 0) {
      console.log("     任务   进度");
      for (let item of $.taskList) {
        console.log(`[${item["taskName"]}]  ${item["gainedNum"]}/${item["totalNum"]}   ${item["isFinished"]}`);
      }
    }
    resolve()
  })
}
//助力好友
async function doHelp() {
  for (let plantUuid of newShareCodes) {
    console.log(`开始助力京东账号${$.index} - ${$.nickName}的好友: ${plantUuid}`);
    if (!plantUuid) continue;
    if (plantUuid === $.myPlantUuid) {
      console.log(`\n跳过自己的plantUuid\n`)
      continue
    }
    await helpShare(plantUuid);
    if ($.helpResult && $.helpResult.code === '0') {
      // console.log(`助力好友结果: ${JSON.stringify($.helpResult.data.helpShareRes)}`);
      if ($.helpResult.data.helpShareRes) {
        if ($.helpResult.data.helpShareRes.state === '1') {
          console.log(`助力好友${plantUuid}成功`)
          console.log(`${$.helpResult.data.helpShareRes.promptText}\n`);
        } else if ($.helpResult.data.helpShareRes.state === '2') {
          console.log('您今日助力的机会已耗尽，已不能再帮助好友助力了\n');
          break;
        } else if ($.helpResult.data.helpShareRes.state === '3') {
          console.log('该好友今日已满9人助力/20瓶营养液,明天再来为Ta助力吧\n')
        } else if ($.helpResult.data.helpShareRes.state === '4') {
          console.log(`${$.helpResult.data.helpShareRes.promptText}\n`)
        } else {
          console.log(`助力其他情况：${JSON.stringify($.helpResult.data.helpShareRes)}`);
        }
      }
    } else {
      console.log(`助力好友失败: ${JSON.stringify($.helpResult)}`);
    }
  }
}
function showMsg() {
  $.log(`\n${message}\n`);
  jdNotify = $.getdata('jdPlantBeanNotify') ? $.getdata('jdPlantBeanNotify') : jdNotify;
  if (!jdNotify || jdNotify === 'false') {
    $.msg($.name, subTitle, message);
  }
}
// ================================================此处是API=================================
//每轮种豆活动获取结束后,自动收取京豆
async function getReward() {
  const body = {
    "roundId": lastRoundId
  }
  $.getReward = await request('receivedBean', body);
}
//收取营养液
async function cultureBean(currentRoundId, nutrientsType) {
  let functionId = arguments.callee.name.toString();
  let body = {
    "roundId": currentRoundId,
    "nutrientsType": nutrientsType,
  }
  $.cultureBeanRes = await request(functionId, body);
}
//偷营养液大于等于3瓶的好友
//①查询好友列表
async function stealFriendList() {
  const body = {
    pageNum: '1'
  }
  $.stealFriendList = await request('plantFriendList', body);
}

//②执行偷好友营养液的动作
async function collectUserNutr(paradiseUuid) {
  console.log('开始偷好友');
  // console.log(paradiseUuid);
  let functionId = arguments.callee.name.toString();
  const body = {
    "paradiseUuid": paradiseUuid,
    "roundId": currentRoundId
  }
  $.stealFriendRes = await request(functionId, body);
}
async function receiveNutrients() {
  $.receiveNutrientsRes = await request('receiveNutrients', {"roundId": currentRoundId, "monitor_refer": "plant_receiveNutrients"})
  // console.log(`定时领取营养液结果:${JSON.stringify($.receiveNutrientsRes)}`)
}
async function plantEggDoLottery() {
  $.plantEggDoLotteryResult = await requestGet('plantEggDoLottery');
}
//查询天天扭蛋的机会
async function egg() {
  $.plantEggLotteryRes = await requestGet('plantEggLotteryIndex');
}
async function productTaskList() {
  let functionId = arguments.callee.name.toString();
  $.productTaskList = await requestGet(functionId, {"monitor_refer": "plant_productTaskList"});
}
async function plantChannelTaskList() {
  let functionId = arguments.callee.name.toString();
  $.plantChannelTaskList = await requestGet(functionId);
  // console.log('$.plantChannelTaskList', $.plantChannelTaskList)
}
async function shopTaskList() {
  let functionId = arguments.callee.name.toString();
  $.shopTaskListRes = await requestGet(functionId, {"monitor_refer": "plant_receiveNutrients"});
  // console.log('$.shopTaskListRes', $.shopTaskListRes)
}
async function receiveNutrientsTask(awardType) {
  const functionId = arguments.callee.name.toString();
  const body = {
    "monitor_refer": "receiveNutrientsTask",
    "awardType": `${awardType}`,
  }
  $.receiveNutrientsTaskRes = await requestGet(functionId, body);
}
async function plantShareSupportList() {
  $.shareSupportList = await requestGet('plantShareSupportList', {"roundId": ""});
  if ($.shareSupportList && $.shareSupportList.code === '0') {
    const { data } = $.shareSupportList;
    //当日北京时间0点时间戳
    const UTC8_Zero_Time = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000;
    //次日北京时间0点时间戳
    const UTC8_End_Time = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000 + (24 * 60 * 60 * 1000);
    let friendList = [];
    data.map(item => {
      if (UTC8_Zero_Time <= item['createTime'] && item['createTime'] < UTC8_End_Time) {
        friendList.push(item);
      }
    })
    message += `【助力您的好友】共${friendList.length}人`;
  } else {
    console.log(`异常情况：${JSON.stringify($.shareSupportList)}`)
  }
}
//助力好友的api
async function helpShare(plantUuid) {
  console.log(`\n开始助力好友: ${plantUuid}`);
  const body = {
    "plantUuid": plantUuid,
    "wxHeadImgUrl": "",
    "shareUuid": "",
    "followType": "1",
  }
  $.helpResult = await request(`plantBeanIndex`, body);
  console.log(`助力结果的code:${$.helpResult && $.helpResult.code}`);
}
async function plantBeanIndex() {
  $.plantBeanIndexResult = await request('plantBeanIndex');//plantBeanIndexBody
}
function readShareCode() {
  return new Promise(async resolve => {
    $.get({url: `https://api.sharecode.ga/api/bean/${randomCount}`, timeout: 10000}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`随机取个${randomCount}码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(15000);
    resolve()
  })
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > shareCodes.length ? (shareCodes.length - 1) : ($.index - 1);
      newShareCodes = shareCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      newShareCodes = [...new Set([...newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify(newShareCodes)}`)
    resolve();
  })
}
function requireConfig() {
  return new Promise(resolve => {
    console.log('开始获取种豆得豆配置文件\n')
    notify = $.isNode() ? require('./sendNotify') : '';
    //Node.js用户请在jdCookie.js处填写京东ck;
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    const jdPlantBeanShareCodes = $.isNode() ? require('./jdPlantBeanShareCodes.js') : '';
    //IOS等用户直接用NobyDa的jd cookie
    if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
      if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
    } else {
      cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
    }
    console.log(`共${cookiesArr.length}个京东账号\n`)
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(jdPlantBeanShareCodes).forEach((item) => {
        if (jdPlantBeanShareCodes[item]) {
          $.shareCodesArr.push(jdPlantBeanShareCodes[item])
        }
      })
    } else {
      if ($.getdata('jd_plantbean_inviter')) $.shareCodesArr = $.getdata('jd_plantbean_inviter').split('\n').filter(item => !!item);
      console.log(`\nBoxJs设置的${$.name}好友邀请码:${$.getdata('jd_plantbean_inviter') ? $.getdata('jd_plantbean_inviter') : '暂无'}\n`);
    }
    // console.log(`\n种豆得豆助力码::${JSON.stringify($.shareCodesArr)}`);
    console.log(`您提供了${$.shareCodesArr.length}个账号的种豆得豆助力码\n`);
    resolve()
  })
}
function requestGet(function_id, body = {}) {
  if (!body.version) {
    body["version"] = "9.0.0.1";
  }
  body["monitor_source"] = "plant_app_plant_index";
  body["monitor_refer"] = "";
  return new Promise(async resolve => {
    await $.wait(2000);
    const option = {
      url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld`,
      headers: {
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'User-Agent': 'JD4iPhone/167283 (iPhone;iOS 13.6.1;Scale/3.00)',
        'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': "application/x-www-form-urlencoded"
      },
      timeout: 10000,
    };
    $.get(option, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n种豆得豆: API查询请求失败 ‼️‼️')
          $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      },
      "timeout": 10000,
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function request(function_id, body = {}){
  return new Promise(async resolve => {
    await $.wait(2000);
    $.post(taskUrl(function_id, body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n种豆得豆: API查询请求失败 ‼️‼️')
          console.log(`function_id:${function_id}`)
          $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function taskUrl(function_id, body) {
  body["version"] = "9.2.4.0";
  body["monitor_source"] = "plant_app_plant_index";
  body["monitor_refer"] = "";
  return {
    url: JD_API_HOST,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&area=19_1601_50258_51885&build=167490&clientVersion=9.3.2`,
    headers: {
      "Cookie": cookie,
      "Host": "api.m.jd.com",
      "Accept": "*/*",
      "Connection": "keep-alive",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    timeout: 10000,
  }
}
function getParam(url, name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  const r = url.match(reg)
  if (r != null) return unescape(r[2]);
  return null;
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
