import React from 'react';
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

const ParticipantSearch = props => {
    const participants = JSON.parse(props.participants);

    const participantList = participants.map(
        participant => <ParticipantRow key={participant.id} url={props.url} participant={participant} />
    );

    return (
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
    );
};

if (document.getElementById('participant-search')) {
    const element = document.getElementById('participant-search');
    ReactDOM.render(<ParticipantSearch {...(element.dataset)}/>, element);
}
