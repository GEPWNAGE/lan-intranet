import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const ParticipantRow = props => (
    <tr>
      <td>{props.participant.id}</td>
      <td>{props.participant.name}</td>
      <td>
        <a
          href={props.url.replace('_participant_', props.participant.id)}
          className="btn btn-primary">
          Show
        </a>
      </td>
    </tr>
);

const SearchBar = props => (
    <input className="form-control"
           value={props.value}
           onChange={props.onChange}
           placeholder="Search"
           autoFocus/>
);

const ParticipantSearch = props => {
    const [search, setSearch] = useState('');

    const participants = JSON.parse(props.participants);

    const participantList = participants.filter(
        participant => search == '' || participant.name.toLowerCase().match(search)
    ).map(
        participant => <ParticipantRow key={participant.id} url={props.url} participant={participant} />
    );

    return (
        <div>
          <SearchBar value={search} onChange={e => setSearch(e.target.value.toLowerCase())}/>
          <br/>
          <table className="table">
            <thead>
              <tr>
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
