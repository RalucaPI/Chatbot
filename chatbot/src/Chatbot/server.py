from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}}, supports_credentials=True) 

genai.configure(api_key="your key")

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

@app.route("/", methods=["POST", "OPTIONS"])  
def chat():
    if request.method == "OPTIONS":
        return '', 200 

    try:
        data = request.get_json()
        user_input = data.get("prompt", "")
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(user_input)

        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
