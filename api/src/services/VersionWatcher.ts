import chokidar from 'chokidar';

class VersionWatcher {
    private version = Date.now();

    start(paths: string[]) {
        chokidar
            .watch(paths, {
                ignoreInitial: true,
            })
            .on('all', (_, file) => {
                this.version = Date.now();
            });
    }

    getVersion() {
        return this.version;
    }
}

export const versionWatcher = new VersionWatcher();
