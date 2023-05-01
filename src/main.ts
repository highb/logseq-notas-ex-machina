import '@logseq/libs';
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
import axios, { AxiosError } from 'axios';
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
    'Send Block as Prompt to OpenAI',
    async () => {
      const block = await logseq.Editor.getCurrentBlock();

      if (block) {
        const { content, uuid } = block;
        
        let connectingBlock = await logseq.Editor.insertBlock(
          block.uuid, `Connecting to OpenAI API...`);
        if(connectingBlock) {
          const chat = new ChatOpenAI({ temperature: 0, openAIApiKey: openAIApiKey });
          try {
            const response = await chat.call([
              new HumanChatMessage(content),
            ]);
            await logseq.Editor.removeBlock(connectingBlock.uuid);
            let responseBlock = await logseq.Editor.insertBlock(
              block.uuid, `${response.text}`);
          } catch (error) {
            await logseq.Editor.removeBlock(connectingBlock.uuid);
            if (axios.isAxiosError(error) && error.response) {
              // If the error was a 401, then the API key is invalid and we should prompt the user to update it
              if(error.response.status == 401) {
                let errorBlock = await logseq.Editor.insertBlock(
                  block.uuid, `Invalid OpenAI API key. Please update in plugin settings`);
              } else {
                let errorBlock = await logseq.Editor.insertBlock(
                  block.uuid, `Error connecting to OpenAI API. Status: ${error.response.status} Message: ${error.message}`);
              }
            } else {
              let errorBlock = await logseq.Editor.insertBlock(
                block.uuid, `Error connecting to OpenAI API: ${error}`);
            }
            
          }
        }
          
        
      } else {
        logseq.UI.showMsg('No block selected');
      }
    },
  )

}
logseq.useSettingsSchema(settingsSchema).ready(main).catch(console.error);