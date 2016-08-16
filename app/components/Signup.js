var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

function Signup(props) {
  return (
    <div className="main-container">
      <nav className="navbar">
        <div className="navbar-header">
          <h1 className="navbar-brand"><Link to='/'>Streetfood Finder</Link></h1>
        </div>
      </nav>
      <div className="inner-container signup-form">
        <form onSubmit={props.onSubmitUser}>
          <p>{props.errorMessage}</p>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" className="form-control" value={props.email} onChange={props.onUpdateEmail} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" className="form-control" value={props.password} onChange={props.onUpdatePassword} />
          </div>
          <button type="submit" className="btn btn-success">Sign Up</button>
        </form>
      </div>
    </div>
  )
}

module.exports = Signup;