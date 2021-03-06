import React, {Component} from 'react';

import Autocomplete from 'react-autocomplete';
import PagedList from "./PagedList";
import ConfirmationModal from './ConfirmationModal';

export default class MemberList extends Component {
    state = {
        activePage: 1,
        isModalOpen: false,
        modalSpec: {}
    }

    handlePageChange = (activePage) => {
        this.setState({activePage})
    }

    get items() {
        let propagatedProps = {
            newMemberItems: this.props.newMemberItems,
            nameKey: this.props.nameKey,
            disabled: this.props.disabled,
            itemLinkClass: this.props.itemLinkClass,
            addMember: this.addMember,
            removeMember: this.removeMember
        }
        return this.props.items.map((item) => ({
            ...propagatedProps,
            ...item
        })).concat({...propagatedProps});
    }

    addMember = (member) => {
        let message;
        if(this.props.groupName)
            message = `Add ${member} to group ${this.props.groupName}`
        else
            message = `Add ${this.props.userName} to group ${member}`

        this.setState({
            isModalOpen: true,
            modalSpec: {
                message,
                action: (() => {
                    this.setState({isModalOpen: false});
                    this.props.addMember(member);
                }),
                buttonStyle: "bg-success",
                confirmText: "Add"
            }
        })
    }

    removeMember = (member) => {
        let message;
        if(this.props.groupName)
            message = `Remove ${member} from group ${this.props.groupName}`
        else
            message = `Remove ${this.props.userName} from group ${member}`

        this.setState({
            isModalOpen: true,
            modalSpec: {
                message,
                action: (() => {
                    this.setState({isModalOpen: false});
                    this.props.removeMember(member)
                }),
                confirmText: "Remove"
            }
        })
    }

    render() {
        return (
            <React.Fragment>
                <ConfirmationModal isOpen={this.state.isModalOpen}
                                   onRequestClose={() => this.setState({isModalOpen: false})}
                                   onConfirm={this.state.modalSpec.action}
                                   message={this.state.modalSpec.message}
                                   buttonStyle={this.state.modalSpec.buttonStyle}
                                   confirmText={this.state.modalSpec.confirmText} />
                <PagedList listItem={MemberItem}
                           columnNames={["Name", "Set membership"]}
                           items={this.items}
                           itemCount={this.items.length}
                           activePage={this.state.activePage}
                           onPageChange={this.handlePageChange}
                           tableStyle={{"overflowX": "visible"}}/>
            </React.Fragment>
        )
    }
}

class MemberItem extends Component {
    state = {
        newMember: ""
    }

    render() {
        if (!this.props[this.props.nameKey]) {
            return (
                <tr>
                    <td style={{textAlign: 'left'}}>
                        <Autocomplete
                            value={this.state.newMember}
                            inputProps={{id: 'states-autocomplete'}}
                            wrapperStyle={{position: 'relative', display: 'inline-block'}}
                            items={this.props.newMemberItems}
                            getItemValue={(item) => item[this.props.nameKey]}
                            shouldItemRender={(item, value) => {
                                return (item[this.props.nameKey].toLowerCase().indexOf(value.toLowerCase()) !== -1);
                            }}
                            onChange={event => this.setState({newMember: event.target.value})}
                            onSelect={value => this.setState({newMember: value})}
                            renderInput={(props) =>
                                <input {...props} className='form-control'/>
                            }
                            renderMenu={children =>
                                <div className={"dropdown-menu " + (children.length !== 0 ? "show" : "")}>
                                    {
                                        children.map((c,idx) =>
                                            <a key={idx} href="#dropdown" className="dropdown-item" style={{"cursor": "pointer"}}>
                                                {c}
                                            </a>
                                        )
                                    }
                                </div>
                            }
                            renderItem={(item, isHighlighted) => (
                                <div
                                    className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                                    key={item[this.props.nameKey]}
                                >{item[this.props.nameKey]}</div>
                            )}
                        />
                    </td>
                    <td>
                        {
                            <button type="button" className="btn btn-success"
                                    onClick={() => !this.props.disabled && this.props.addMember(this.state.newMember)}
                                    disabled={this.props.disabled}>
                                Add member
                            </button>
                        }
                    </td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td style={{textAlign: 'left'}}>
                        <this.props.itemLinkClass {...this.props}/>
                    </td>
                    <td>
                        {
                            <button type="button" className="btn btn-danger"
                                    onClick={() => !this.props.disabled && this.props.removeMember(this.props[this.props.nameKey])}
                                    disabled={this.props.disabled}>
                                Remove member
                            </button>
                        }
                    </td>
                </tr>
            );
        }
    }
}   
