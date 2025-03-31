import { Container } from "react-bootstrap";
import "./ProfileHeader.css";

const ProfileNavigation = ({Profile, Alamat}) => { 
    return (
        <Container>
            <div className="profile-header">
                <br />
                <a href="/pembeli/profile" style={Profile}>Profile</a> 
                <span><a href="/pembeli/alamat" style={Alamat}>Alamat</a></span>
                <hr />
            </div>
        </Container>
    );
};

export default ProfileNavigation;