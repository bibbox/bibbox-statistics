import React            from 'react';
import ReactDOM         from 'react-dom';
import CountUp          from 'react-countup';
import                  'whatwg-fetch';


const URL = 'http://elastic-el.demo.bibbox.org';

class Root extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            machines: 0,
            apps_installed: 0,
            cpus: 0,
            memory: 0,
            storage: 0,
            apps: 0,
            reviewed: 0,
            docker_images: 0,
            docker_downloads: 0,
            git_commits: 0
        };
    }

    getMachineData() {
        fetch(URL + '/bibbox/_search?size=9999', {
            method: 'POST',
            body: '{"query": {"match" : {"_type" : "general-machine"}}}',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((json) => {
            this.getMachineValues(json.hits.hits);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getMachineValues(hits) {
        let state = {
            machines: 0,
            cpus: 0,
            memory: 0,
            storage: 0
        };

        let machine_ids = {};

        for(let hit of hits) {
            state.machines++;
            const context = hit._source.context;

            if(context.hasOwnProperty('machine_id')) {
                machine_ids[context['machine_id']] = context['machine_id'];
            }
            if(context.hasOwnProperty('cpus')) {
                state.cpus += parseInt(context['cpus']);
            }
            if(context.hasOwnProperty('memory')) {
                state.memory += parseInt(context['memory']);
            }
            if(context.hasOwnProperty('storage')) {
                state.storage += parseInt(context['storage']);
            }
        }
        this.setState(state);
    }

    getAppCount() {
        fetch(URL + '/bibbox/_search?size=0&pretty&fielddata_fields=true', {
            method: 'POST',
            body: '{"query": {"match" : {"_type" : "general"}}, "aggs": {"unique_vals": {"terms": {"field": "_type"}}}}',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((json) => {
            this.setState({
                apps_installed: json['aggregations']['unique_vals']['buckets'][0]['doc_count']
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getTechnicalData() {
        fetch(URL + '/bibbox/technical/1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((json) => {
            this.setState({
                apps: json._source['store_apps'],
                reviewed: json._source['apps_reviewed'],
                docker_images: json._source['docker_images'],
                docker_downloads: json._source['docker_downloads'],
                git_commits: json._source['git_commits'],
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getData() {
        this.getMachineData();
        this.getAppCount();
        this.getTechnicalData();
    }

    componentDidMount() {
        this.getData();

        setTimeout(() => {
            this.getData();
        }, 10000);
    }

    byteToGigabyte(byte) {
        const gb = byte / 1024 / 1024 / 1024;
        return Math.round(gb);
    }

    kiloByteToGigabyte(kb) {
        const gb = kb / 1024 / 1024;
        return Math.round(gb);
    }

    render() {
        return (
            <div id="component-root">
                <div className="statistics-panel">
                    <div className="statistics-head">
                        <a href="/machines">
                            <img src="http://bibbox-hq.tools.bbmri-eric.eu/wp-content/uploads/2017/06/logo.png" />
                            <h1 className="title-head">BIBBOX machines:</h1>
                            <span className="count-head">
                                <CountUp start={0} end={this.state.machines} duration={2.5} useEasing={true} useGrouping={true} separator="." />
                            </span>
                        </a>
                    </div>
                    <div className="statistics-sub">
                        <a href="/apps-installed">
                            <img src="http://bibbox-hq.tools.bbmri-eric.eu/wp-content/uploads/2017/06/apps.png" />
                            <h2 className="title-sub">Apps installed:</h2>
                            <span className="count-sub">
                                <CountUp start={0} end={this.state.apps_installed} duration={2.5} useEasing={true} useGrouping={true} separator="." />
                            </span>
                        </a>
                    </div>
                    <div className="statistics-sub">
                        <a href="/technical-catalogue/bibbox-hardware">
                            <img src="http://bibbox-hq.tools.bbmri-eric.eu/wp-content/uploads/2017/08/cpu.png" />
                            <h2 className="title-sub">CPUs used:</h2>
                            <span className="count-sub">
                                <CountUp start={0} end={this.state.cpus} duration={2.5} useEasing={true} useGrouping={true} separator="." />
                            </span>
                        </a>
                    </div>
                    <div className="statistics-sub">
                        <a href="/technical-catalogue/bibbox-hardware">
                            <img src="http://bibbox-hq.tools.bbmri-eric.eu/wp-content/uploads/2017/08/ram.png" />
                            <h2 className="title-sub">Memory used:</h2>
                            <span className="count-sub">
                                <CountUp start={0} end={this.kiloByteToGigabyte(this.state.memory)} duration={2.5} useEasing={true} useGrouping={true} separator="." /> GB
                            </span>
                        </a>
                    </div>
                    <div className="statistics-sub">
                        <a href="/technical-catalogue/bibbox-hardware">
                            <img src="http://bibbox-hq.tools.bbmri-eric.eu/wp-content/uploads/2017/08/disk.png" />
                            <h2 className="title-sub">Disk space used:</h2>
                            <span className="count-sub">
                                <CountUp start={0} end={this.byteToGigabyte(this.state.storage)} duration={2.5} useEasing={true} useGrouping={true} separator="." /> GB
                            </span>
                        </a>
                    </div>
                </div>
                <div className="statistics-panel">
                    <div className="statistics-head">
                        <a href="https://github.com/bibbox?utf8=%E2%9C%93&q=app-&type=&language=" target="_blank">
                            <img src="http://bibbox-hq.tools.bbmri-eric.eu/wp-content/uploads/2017/06/cloud.png" />
                            <h1 className="title-head">BIBBOX apps:</h1>
                            <span className="count-head">
                                <CountUp start={0} end={this.state.apps} duration={2.5} useEasing={true} useGrouping={true} separator="." />
                            </span>
                        </a>
                    </div>
                    <div className="statistics-sub">
                        <a href="/resources/tools-shortlist">
                            <img src="http://bibbox-hq.tools.bbmri-eric.eu/wp-content/uploads/2017/06/review.png" />
                            <h2 className="title-sub">Apps reviewed:</h2>
                            <span className="count-sub">
                                <CountUp start={0} end={this.state.reviewed} duration={2.5} useEasing={true} useGrouping={true} separator="." />
                            </span>
                        </a>
                    </div>
                    <div className="statistics-sub">
                        <a href="https://hub.docker.com/u/bibbox/" target="_blank">
                            <img src="http://bibbox-hq.tools.bbmri-eric.eu/wp-content/uploads/2017/06/dockers.png" />
                            <h2 className="title-sub">Docker images:</h2>
                            <span className="count-sub">
                                <CountUp start={0} end={this.state.docker_images} duration={2.5} useEasing={true} useGrouping={true} separator="." />
                            </span>
                        </a>
                    </div>
                    <div className="statistics-sub">
                        <a href="https://hub.docker.com/u/bibbox/" target="_blank">
                            <img src="http://bibbox-hq.tools.bbmri-eric.eu/wp-content/uploads/2017/06/download.png" />
                            <h2 className="title-sub">Docker downloads:</h2>
                            <span className="count-sub">
                                <CountUp start={0} end={this.state.docker_downloads} duration={2.5} useEasing={true} useGrouping={true} separator="." />
                            </span>
                        </a>
                    </div>
                    <div className="statistics-sub">
                        <a href="https://github.com/bibbox" target="_blank">
                            <img src="http://bibbox-hq.tools.bbmri-eric.eu/wp-content/uploads/2017/06/commits.png" />
                            <h2 className="title-sub">GitHub commits:</h2>
                            <span className="count-sub">
                                <CountUp start={0} end={this.state.git_commits} duration={2.5} useEasing={true} useGrouping={true} separator="." />
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}


/* Renders the application in the DOM */
ReactDOM.render(<Root />, document.getElementById('root'));