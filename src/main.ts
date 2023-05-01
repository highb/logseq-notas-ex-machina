import '@logseq/libs';
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

let openAIApiKey = "";
const settingsSchema: SettingSchemaDesc[] = [
  {
    key: "openAIApiKey",
    default: "",
    description: "OpenAI API Dev Token",
    title: "OpenAI API Token",
    type: "string",
  },
]

function onSettingsChange() {
  logseq.UI.showMsg('Plugin settings changed!');
  openAIApiKey = logseq.settings?.openAIApiKey;
}

async function main() {
  logseq.UI.showMsg('Plugin started load: Hello, LogSeq!');

  onSettingsChange();
  logseq.onSettingsChanged(onSettingsChange);
  // Set configuration screen for the OpenAI API key


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
        
        const chat = new ChatOpenAI({ temperature: 0, openAIApiKey: openAIApiKey });
        const response = await chat.call([
          new HumanChatMessage(content),
        ]);
        let insertedBlock = await logseq.Editor.insertBlock(
          block.uuid, `${response.text}`);
          
        
      } else {
        logseq.UI.showMsg('No block selected');
      }
    },
  )

}
logseq.useSettingsSchema(settingsSchema).ready(main).catch(console.error);