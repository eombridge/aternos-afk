// index.js
// 이 파일은 봇의 메인 로직을 담고 있습니다.

const mineflayer = require('mineflayer');

// 환경 변수에서 서버 정보와 봇 이름을 가져옵니다.
const server = process.env.MC_SERVER;
const port = parseInt(process.env.MC_PORT);
const username = process.env.MC_USERNAME || 'AFKBot';

// 서버 정보가 올바르게 설정되었는지 확인합니다.
if (!server || !port) {
    console.error('오류: 환경 변수 MC_SERVER와 MC_PORT가 설정되지 않았습니다.');
    console.error('Render 대시보드에서 환경 변수를 설정해주세요.');
    process.exit(1);
}

// 봇의 연결 옵션을 설정합니다.
// Render 대시보드에서 설정한 환경 변수가 적용됩니다.
const botOptions = {
    host: server,
    port: port,
    username: username,
    version: '1.20.1' // 마인크래프트 서버 버전에 맞게 수정해주세요.
};

// 봇을 생성하고 연결을 시도합니다.
const bot = mineflayer.createBot(botOptions);

// 봇의 다양한 이벤트를 처리합니다.

// 봇이 서버에 성공적으로 접속했을 때
bot.on('login', () => {
    console.log(`[봇 상태] 서버에 접속했습니다! 봇 이름: ${bot.username}`);
});

// 봇이 서버에 완전히 스폰되었을 때
bot.on('spawn', () => {
    console.log('[봇 상태] 성공적으로 게임에 스폰되었습니다!');
    // 봇이 채팅을 보내는 예시
    bot.chat('안녕하세요! 잠수봇입니다.');
});

// 서버 채팅을 감지했을 때
bot.on('chat', (username, message) => {
    // 봇 자신이 보낸 메시지는 무시합니다.
    if (username === bot.username) return;

    console.log(`[채팅] <${username}>: ${message}`);

    // 특정 메시지에 반응하는 예시
    if (message === '안녕') {
        bot.chat(`안녕하세요, ${username}님!`);
    } else if (message === '현재시간') {
        const now = new Date();
        bot.chat(`현재 시간은 ${now.toLocaleTimeString()} 입니다.`);
    }
});

// 봇 연결이 끊겼을 때
bot.on('end', (reason) => {
    console.log(`[봇 상태] 서버와의 연결이 끊겼습니다. 이유: ${reason}`);
    // 연결이 끊기면 5초 후 재접속을 시도합니다.
    setTimeout(() => {
        console.log('[봇 상태] 재접속을 시도합니다...');
        reconnect();
    }, 5000);
});

// 오류가 발생했을 때
bot.on('error', (err) => {
    console.error(`[오류] 봇 오류 발생: ${err.message}`);
});

// 봇이 종료되는 것을 방지하기 위해 10초마다 콘솔에 로그를 출력합니다.
// Render 서비스가 유휴 상태로 전환되는 것을 막는 데 도움이 됩니다.
setInterval(() => {
    console.log('[유지] 봇이 정상적으로 실행 중입니다.');
}, 10000);

// 재접속을 위한 함수
function reconnect() {
    bot.quit();
    bot.end();
    // 봇을 다시 생성하여 연결을 시도합니다.
    const newBot = mineflayer.createBot(botOptions);
    // 이벤트 리스너를 다시 설정합니다.
    newBot.on('login', () => {
        console.log(`[봇 상태] 서버에 재접속했습니다! 봇 이름: ${newBot.username}`);
    });
    // 다른 이벤트 리스너들도 필요에 따라 추가합니다.
    newBot.on('end', (reason) => {
        console.log(`[봇 상태] 재접속 후 연결이 끊겼습니다. 이유: ${reason}`);
        setTimeout(() => {
            reconnect();
        }, 5000);
    });
    newBot.on('error', (err) => {
        console.error(`[오류] 재접속 중 오류 발생: ${err.message}`);
    });
}
