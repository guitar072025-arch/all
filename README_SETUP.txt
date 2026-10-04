# ALL AI Voice

GitHub Pages側は `index.html` + `background.png` です。
本物のAI回答には Cloudflare Workers を使います。

## 1. Cloudflare Worker
1. Cloudflareにログイン
2. Workers & Pages → Create → Worker
3. `worker.js` の内容を貼り付けてDeploy
4. Worker Settings → Variables and Secrets
5. Secretを追加:
   - Name: `OPENAI_API_KEY`
   - Value: 自分のOpenAI API key
6. WorkerのURLをコピー

## 2. GitHub側
`index.html` のこの行を変更:
const API_URL = "https://YOUR-WORKER.workers.dev/chat";

実際にはWorker全体のURLを入れます。
例:
const API_URL = "https://all-ai-api.xxxxx.workers.dev";

その後GitHubへcommit。

## 3. 音声
- 🎙️ボタン: ブラウザの音声認識
- AI回答: OpenAI Responses API
- 回答読み上げ: ブラウザの SpeechSynthesis
- 「AIの回答を自動で読み上げる」でON/OFF

## セキュリティ
OpenAI API keyを `index.html` に書かないでください。
GitHubの公開リポジトリにAPI keyを置くと漏洩する可能性があります。
