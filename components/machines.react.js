import React            from 'react';
import ReactDOM         from 'react-dom';
import                  'jquery';
import                  'whatwg-fetch';


const URL = 'http://elastic-el.demo.bibbox.org';

class Machines extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logged_id: jQuery('body').hasClass('logged-in'),
            list: []
        };
    }

    getMachines() {
        fetch(URL + '/bibbox/_search?size=1000', {
            method: 'POST',
            body: '{"query": {"match" : {"_type" : "general-machine"}}}',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((json) => {
            this.setState({
                list: json['hits']['hits']
            });

            this.getAppCount();
        })
        .catch((error) => {
            alert("Could not get data");
            console.log(error);
        });
    }

    getAppCount() {
        fetch(URL + '/bibbox/_search?size=0', {
            method: 'POST',
            body: '{"aggs": {"unique_vals": {"terms": {"field": "machineid.keyword"}}}}',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((json) => {
            let state = this.state;

            for(let i = 0; i < state.list.length; i++) {
                for(const item of json['aggregations']['unique_vals']['buckets']) {
                    if(item.key === state.list[i]['_id']) {
                        state.list[i]['app count'] = item['doc_count'];
                    }
                    else if(!state.list[i].hasOwnProperty('app count')) {
                        state.list[i]['app count'] = 0;
                    }
                }
            }

            this.setState(state);
        })
        .catch((error) => {
            alert("Could not get data");
            console.log(error);
        });
    }

    componentDidMount() {
        this.getMachines();

        setTimeout(() => {
            this.getMachines();
        }, 10000);
    }

    getDateTime(timestamp) {
        const a = new Date(timestamp * 1000);
        // const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const year = a.getFullYear();
        // const month = months[a.getMonth()];
        const month = a.getMonth() > 9 ? a.getMonth() : '0' + a.getMonth();
        const date = a.getDate() > 9 ? a.getDate() : '0' + a.getDate();
        const hour = a.getHours() > 9 ? a.getHours() : '0' + a.getHours();
        const min = a.getMinutes() > 9 ? a.getMinutes() : '0' + a.getMinutes();
        const sec = a.getSeconds() > 9 ? a.getSeconds() : '0' + a.getSeconds();
        return date + '.' + month + '.' + year + ' ' + hour + ':' + min + ':' + sec;
    }

    showMore(machine) {
        if(this.state.logged_id) {
            console.log(machine);
            alert('User is logged in, show additional data...');
        }
        else {
            alert('Please log in to see more!');
        }
    }

    render() {
        return (
            <div id="component-instances">
                <table>
                    <thead>
                        <tr>
                            <th>Machine ID</th>
                            <th>Status</th>
                            <th>Installed apps</th>
                            <th>Hypervisor</th>
                            <th>Availability</th>
                            <th>Link</th>
                            {/* <th></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.list.map((machine) => {
                                return (
                                    <tr key={machine._id}>
                                        <td>{machine._id}</td>
                                        <td>{machine._source['configuration']['status']}</td>
                                        <td>{machine['app count']}</td>
                                        {/* <td>{this.getDateTime(machine._source['created'])}</td> */}
                                        <td>{machine._source['configuration']['hypervisor']}</td>
                                        <td>{machine._source['configuration']['availability']}</td>
                                        <td>
                                            <a href={'http://' + machine._source['context']['machine_id']} target="_blank">
                                                Link
                                            </a>
                                        </td>
                                        {/* <td><a href="#" onClick={() => this.showMore(machine)}>more</a></td> */}
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}


/* Renders the application in the DOM */
ReactDOM.render(<Machines />, document.getElementById('machines'));