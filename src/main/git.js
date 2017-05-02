import git from 'nodegit';

export default class Git {
  static async clone(url, path) {
    return await git.Clone(url, path);
  }

  static async init(path) {
    return await git.Repository.init(path, 0);
  }

  static async pull(path) {
    const repo = await git.Repository.open(path);

    await repo.fetchAll({
      callbacks: {
        credentials: function(url, userName) {
          return git.Cred.sshKeyFromAgent(userName);
        },
        certificateCheck: function() {
          return 1;
        }
      }
    });

    await repo.mergeBranches('master', 'origin/master');
  }
}
