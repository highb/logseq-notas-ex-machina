import '@logseq/libs';
async function main() {
  logseq.UI.showMsg('Plugin started load: Hello, LogSeq!');

  // When the /hello slash command is used, the following code will be executed
  logseq.App.registerSlashCommand({
    id: 'hello',
    fn: async () => {
      logseq.App.showMsg('Hello, LogSeq!');
    }
  });
}
logseq.ready(main).catch(console.error);