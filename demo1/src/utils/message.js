export function showMessage(message, type) {
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const offset = screenHeight * 0.4; // 设置为屏幕高度的五分之二
    Message({
        message: message,
        type: type,
        position: 'top',
        offset: offset,
        duration: 1500
    });
}