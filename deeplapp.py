from concurrent.futures import thread
import os
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
import re
from translate import translate_with_deepl

# ボットトークンとソケットモードハンドラーを使ってアプリを初期化します
app = App(token=os.environ.get("SLACK_BOT_TOKEN"))

# 'hello' を含むメッセージをリッスンします
# 指定可能なリスナーのメソッド引数の一覧は以下のモジュールドキュメントを参考にしてください：
# https://slack.dev/bolt-python/api-docs/slack_bolt/kwargs_injection/args.html

@app.event("app_mention")
def translate_app_mention(event, say):
    # welcome_channel_id = "C12345"
    # user_id = event["user"]
    text = re.sub('<.*?>', '', event['text'])
    say(text=translate_with_deepl(text), thread_ts=event['ts'])

# スタンプ押されたら反応するやつ
@app.event("reaction_added")
def translate_reaction_added(client, event, say):
    if event['reaction'] == 'mega':
        channel = event["item"]["channel"]
        ts = event["item"]["ts"]

        # タイムスタンプでメッセージを特定
        conversations_history = client.conversations_history(channel=channel, oldest=ts, latest=ts, inclusive=1)

        message = conversations_history.data["messages"][0]
        
        print("----"*10)
        print(message['text'])
        print("----"*10)
        
        text = re.sub('<.*?>', '', message['text'])
        say(text=translate_with_deepl(text), thread_ts=ts)

# アプリを起動します
if __name__ == "__main__":
    SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"]).start()