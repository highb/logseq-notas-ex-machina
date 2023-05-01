import '@logseq/libs';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

async function main() {
  logseq.UI.showMsg('Plugin started load: Hello, LogSeq!');

  logseq.Editor.registerSlashCommand(
    'Show Block in Message',
    async () => {
      const block = await logseq.Editor.getCurrentBlock();

      if (block) {
        const { content, uuid } = block;
        logseq.UI.showMsg(`
          [:div.p-2
            [:h1 "#${uuid}"]
            [:h2.text-xl "${content}"]]
        `)
      } else {
        logseq.UI.showMsg('No block selected');
      }
    },
  )

  logseq.Editor.registerSlashCommand(
    'Append to Block',
    async () => {
      const block = await logseq.Editor.getCurrentBlock();

      if (block) {
        const { content, uuid } = block;
        // Append "Hello, LogSeq!" in a new block as a child of the current block
        let insertedBlock = await logseq.Editor.insertBlock(
          block.uuid, `Hello, ${content}!`);
          
        
      } else {
        logseq.UI.showMsg('No block selected');
      }
    },
  )

  logseq.Editor.registerSlashCommand(
    'Send Block as Prompt to Chat AI',
    async () => {
      const block = await logseq.Editor.getCurrentBlock();

      if (block) {
        const { content, uuid } = block;
        
        const chat = new ChatOpenAI({ temperature: 0 });
        // const response = await chat.call([
        //   new HumanChatMessage(content),
        // ]);
        // Append "Hello, LogSeq!" in a new block as a child of the current block
        // let insertedBlock = await logseq.Editor.insertBlock(
        //   block.uuid, `Response: ${response}`);
          
        
      } else {
        logseq.UI.showMsg('No block selected');
      }
    },
  )

}
logseq.ready(main).catch(console.error);