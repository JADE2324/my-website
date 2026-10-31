document.addEventListener('DOMContentLoaded', () => {
    // 绑定按钮点击事件
    const btn = document.getElementById('autoFixBtn') || document.querySelector('button[onclick*="analyzeAll"]');
    if (btn) {
        btn.removeAttribute('onclick'); // 移除旧的报错绑定
        btn.addEventListener('click', analyzeAll);
    }
});

async function analyzeAll() {
    const msgBox = document.getElementById('msg') || document.body.appendChild(document.createElement('div'));
    msgBox.innerText = "正在连接火山方舟，请耐心等待...";
    
    // 找到页面上上传的字幕内容或手动输入的框
    let srtText = "";
    const manualInput = document.getElementById('manual');
    const fileInput = document.getElementById('files');
    
    if (manualInput && manualInput.value) {
        srtText = manualInput.value;
    } else {
        msgBox.innerText = "请先在页面上传 SRT 文件或粘贴字幕！";
        return;
    }

    try {
        const response = await fetch('https://proud-frog-10ea.2321881307.workers.dev/api/proof', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ srt: srtText })
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || "服务器报错");
        
        msgBox.innerText = "✅ AI 校对完成！结果已返回。";
        // 如果有显示结果的地方，就把结果填进去
        const diffBox = document.getElementById('diff');
        if (diffBox) diffBox.innerText = data.result;
        
    } catch (error) {
        msgBox.innerText = "❌ 失败：" + error.message;
    }
}
