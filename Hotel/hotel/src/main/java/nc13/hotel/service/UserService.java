package nc13.hotel.service;

import nc13.hotel.model.UserDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final SqlSession SESSION;
    private final String NAMESPACE = "mapper.UserMapper";

    @Autowired
    public UserService(SqlSession session) {
        SESSION = session;
    }

    public UserDTO selectByUsername(String username) {
        return SESSION.selectOne(NAMESPACE + ".selectByUsername", username);
    }
}
