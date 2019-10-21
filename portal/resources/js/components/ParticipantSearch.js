import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { IoIosArrowForward } from 'react-icons/io';

const ParticipantRow = props => {
    const selected = props.selected ? <IoIosArrowForward size="1.5em"/> : '';
    return (
        <tr>
          <td>{selected}</td>
          <td>{props.participant.id}</td>
          <td>{props.participant.name}</td>
          <td>
            <a
              href={props.url.replace('_participant_', props.participant.id)}
              className="btn btn-sm btn-primary">
              Show
            </a>
          </td>
        </tr>
    );
};

const SearchBar = props => (
    <input className="form-control"
           value={props.value}
           onChange={props.onChange}
           onKeyUp={props.onKeyUp}
           placeholder="Search"
           autoFocus/>
);

const ParticipantSearch = props => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(0);

    const participants = JSON.parse(props.participants);

    let num = 0;
    const participantList = participants.filter(
        participant => search == '' || participant.name.toLowerCase().match(search)
    ).map(
        participant => <ParticipantRow
                         key={participant.id}
                         url={props.url}
                         participant={participant}
                         selected={selected == num++} />
    );

    // move the caret or go to the page of the participant
    const changeSelected = e => {
        if (e.key == 'ArrowUp' && selected > 0) {
            setSelected(selected - 1);
        }
        if (e.key == 'ArrowDown') {
            setSelected(selected + 1);
        }
        if (e.key == 'Enter') {
            const tempList = participants.filter(
                participant => search == '' || participant.name.toLowerCase().match(search)
            );
            const participant = tempList[selected];
            window.location.href = props.url.replace('_participant_', participant.id)
        }
    };
    // search for the participant, reset the caret
    const changeSearch = e => {
        setSelected(0);
        setSearch(e.target.value.toLowerCase());
    };

    return (
        <div>
          <SearchBar
            value={search}
            onChange={changeSearch}
            onKeyUp={changeSelected}/>
          <br/>
          <table className="table">
            <thead>
              <tr>
                <th style={{width: '32px'}}/>
                <th>#</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participantList}
            </tbody>
          </table>
        </div>
    );
};

if (document.getElementById('participant-search')) {
    const element = document.getElementById('participant-search');
    ReactDOM.render(<ParticipantSearch {...(element.dataset)}/>, element);
}
