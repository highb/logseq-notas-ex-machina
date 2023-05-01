import '@logseq/libs';
async function main() {
  logseq.UI.showMsg('Hello, LogSeq!');
}
logseq.ready(main).catch(console.error);
