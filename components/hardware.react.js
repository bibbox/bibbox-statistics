import React            from 'react';
import ReactDOM         from 'react-dom';
import                  'jquery';
import                  'whatwg-fetch';


const URL = 'http://elastic-el.demo.bibbox.org';

class Hardware extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logged_id: jQuery('body').hasClass('logged-in'),
            list: []
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
            this.setState({
                list: json.hits.hits
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.getMachineData();

        setTimeout(() => {
            this.getMachineData();
        }, 10000);
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

    byteToGigabyte(byte) {
        if(typeof byte === 'undefined') {
            return 'unknown';
        }

        const gb = byte / 1024 / 1024 / 1024;
        return Math.round(gb) + ' GB';
    }

    kiloByteToGigabyte(kb) {
        if(typeof kb === 'undefined') {
            return 'unknown';
        }

        const gb = kb / 1024 / 1024;
        return Math.round(gb) + ' GB';
    }

    render() {
        return (
            <div id="component-instances">
                <table>
                    <thead>
                        <tr>
                            <th>Machine ID</th>
                            <th>CPU cores</th>
                            <th>Memory</th>
                            <th>Storage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.list.map((machine) => {
                                return (
                                    <tr key={machine._id}>
                                        <td>{machine._id}</td>
                                        <td>{machine._source['context']['cpus']}</td>
                                        <td>{this.kiloByteToGigabyte(machine._source['context']['memory'])}</td>
                                        <td>{this.byteToGigabyte(machine._source['context']['storage'])}</td>
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
ReactDOM.render(<Hardware />, document.getElementById('hardware'));