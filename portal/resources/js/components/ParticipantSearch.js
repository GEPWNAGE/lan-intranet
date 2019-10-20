import React from 'react';
import ReactDOM from 'react-dom';

const ParticipantSearch = data => {
    const participants = JSON.parse(data.participants);

    const participantList = participants.map(
        participant => <tr key={participant.id}>
                         <td>{participant.id}</td>
                         <td>{participant.name}</td>
                         <td>TODO: Action</td>
                       </tr>
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
