import React from 'react';
import "./homePage.css";
import Activity from './types';

interface OrgListProps {
    orgs: Activity[];
}

const OrgList: React.FC<OrgListProps> = ({ orgs }) => {
    return (
        <div className='org_header'>
            <h2>Student Organizations</h2>
            <p>Let us know which groups you're interested in so we can find some people to connect you with!</p>
            <ul>
                {orgs.map((org) => (
                    <li className='org_list' key={org.id}>
                        <button className='org_listing'>
                            <strong className='org_title'>{org.title}</strong>
                            <p className='org_desc'>{org.description}</p>
                            <p className='org_info'><i>Date: {org.date}</i></p>
                            <p className='org_info'><i>Organizer: {org.organizer}</i></p>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrgList;