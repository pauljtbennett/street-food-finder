var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

function Signup(props) {
  return (
    <div className="main-container">
      <nav className="navbar">
        <div className="navbar-header">
          <h1 className="navbar-brand"><Link to='/'>Street Food Finder</Link></h1>
        </div>
      </nav>
      <div className="inner-container signup-form">
        <form onSubmit={props.onSubmitUser}>
          <p>{props.errorMessage}</p>
          <div className="form-group">
            <input type="email" name="email" id="email" className="form-control top" placeholder="Email" value={props.email} onChange={props.onUpdateEmail} />
          </div>
          <div className="form-group">
            <input type="password" name="password" id="password" className="form-control bottom" placeholder="Password" value={props.password} onChange={props.onUpdatePassword} />
          </div>
          <button type="submit" className="btn btn-success full-width">Sign Up</button>
        </form>
      </div>
      <div className="inner-container">
        <p className="text-center">Already have an account? <Link to='/login'>Sign in</Link></p>
      </div>
    </div>
  )
}

module.exports = Signup;