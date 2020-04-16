import React from 'react';
import AddressAutocomplete from '../Common/AddressAutocomplete';


class HelpForm extends React.Component {
    state = {
        groceries: '',
        timeline: '',
        description: '',
        address: '',
        lat: '',
        lng: '',
    }

    componentDidMount() {
        this.props.submitButtonDelegate.onSubmit = this.onSubmitHelpForm;
        this.props.submitButtonDelegate.clearHelpForm = this.clearForm;
    }

    onSubmitHelpForm = (event) => {
        let newRequest = {
            groceries: this.state.groceries,
            timeline: this.state.timeline,
            description: this.state.description,
            address: this.state.address,
            lat: this.state.lat,
            lng: this.state.lng,
        }
        console.log(newRequest)
        this.props.saveRequest(newRequest);
    }

    clearForm = () => {
        this.setState({
            groceries: '',
            timeline: '',
            description: '',
            address: '',
            lat: '',
            lng: '',
        });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleChangeAutocomplete = (lat, lng, address) => {
        this.setState({
            lat,
            lng,
            address
        });
    }

    render() {
        return (
            // <div className="modal-content postForm">
                <form className="requestForm">
                    <label>Tell us what groceries you need (max 10 items):</label>
                    <div className="row">
                        <div className="groceriesList input-field col s12">
                            <textarea className="materialize-textarea"
                                name="groceries" onChange={this.handleChange} >
                            </textarea>
                        </div>
                    </div>

                    <label>By when do you need them?

                        <select name="timeline" className="browser-default" 
                            defaultValue={''} 
                            onChange={this.handleChange}>
                            <option value="" disabled="disabled">--Please choose an option--</option>
                            <option value="1">Today</option>
                            <option value="2">By tomorrow</option>
                            <option value="3">Some day this week</option>
                        </select>
                        {/* <input name="timeline" onChange={this.handleChange}/> */}
                    </label>

                    <label>Where should we have them delivered?
                        <AddressAutocomplete
                            handleChangeAutocomplete={this.handleChangeAutocomplete}
                        />
                    </label>

                    <label>Additional comments:
                            <input name="description" 
                            onChange={this.handleChange} />
                    </label>

                </form>
            // </div>
        )
    }
}

export default HelpForm;

