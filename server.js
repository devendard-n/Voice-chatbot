import express from "express";
import cors from "cors";
import MistralClient from "@mistralai/mistralai";

const app = express();

app.use(cors());
app.use(express.json());

const client = new MistralClient("A3plPvbHttbCVVWeBBGeD5BUMa4gpLlR");

app.post("/chat", async (req, res) => {

const userMessage = req.body.message;

try {

const response = await client.chat({
model:"mistral-small-latest",
messages:[
{role:"user",content:userMessage}
]
});

const reply=response.choices[0].message.content;

res.json({reply});

}catch(error){

console.error(error);

res.status(500).json({error:error.message});

}

});

app.listen(3000,()=>{

console.log("Server running on http://localhost:3000");

});