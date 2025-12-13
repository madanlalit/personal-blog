import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
    return (
        <div className="contact-container fade-in">
            <header className="page-header">
                <h1 className="page-title">Contact</h1>
            </header>

            <div className="contact-content">
                <p className="lead">
                    Got a project in mind, or just want to chat?
                </p>

                <form className="minimal-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-row">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Jane Doe" />
                    </div>

                    <div className="form-row">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="jane@example.com" />
                    </div>

                    <div className="form-row">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" rows={5} placeholder="Hello..."></textarea>
                    </div>

                    <button type="submit" className="btn-submit">Send Message →</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
