import React            from 'react';
import ReactDOM         from 'react-dom';
import                  'jquery';
import                  'whatwg-fetch';


const URL = 'http://elastic-el.demo.bibbox.org';

class Instances extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logged_id: jQuery('body').hasClass('logged-in'),
            list: []
        };
    }

    getData() {
        fetch(URL + '/bibbox/_search?size=1000&pretty', {
            method: 'POST',
            body: '{"query": {"match" : {"_type" : "general"}}}',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);

            this.setState({
                list: json['hits']['hits']
            });
        })
        .catch((error) => {
            alert("Could not get data");
            console.log(error);
        });
    }

    componentDidMount() {
        this.getData();

        setTimeout(() => {
            this.getData();
        }, 10000);
    }

    getDateTime(timestamp) {
        console.log(timestamp);

        if(typeof timestamp === 'undefined') {
            return 'unknown';
        }

        const b = timestamp.split(/[^0-9]/);
        const a = new Date (b[0],b[1]-1,b[2],b[3],b[4],b[5]);

        //const a = new Date(timestamp.replace(/-/g, "/"));
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

    showMore(instance) {
        if(this.state.logged_id) {
            console.log(instance);
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
                            <th>App ID</th>
                            <th>Machine ID</th>
                            <th>Created</th>
                            <th>URL</th>
                            {/* <th></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.list.map((instance) => {
                                return (
                                    <tr key={instance._id}>
                                        <td>{instance._source['app_description']['app_id']}</td>
                                        <td>{instance._source['context']['machine_id']}</td>
                                        <td>{this.getDateTime(instance._source['app_description']['created'])}</td>
                                        <td>
                                            <a href={instance._source['app_description']['url']} target="_blank">Link</a>
                                        </td>
                                        {/* <td><a href="#" onClick={() => this.showMore(instance)}>more</a></td> */}
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
ReactDOM.render(<Instances />, document.getElementById('instances'));