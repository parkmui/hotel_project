package nc13.hotel.controller;

import nc13.hotel.model.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user/")
public class UserController {
    @RequestMapping("authSuccess")
    public ResponseEntity<Map<String, Object>> authSuccess(Authentication authentication) {
        Map<String, Object> resultMap = new HashMap<>();
        UserDTO userDTO = (UserDTO) authentication.getPrincipal();

        resultMap.put("result","success");
        resultMap.put("id", userDTO.getId());
        resultMap.put("nickname", userDTO.getNickname());
        resultMap.put("role", userDTO.getRole());

        return ResponseEntity.ok(resultMap);
    }

    @RequestMapping("authFail")
    public ResponseEntity<Map<String, Object>> authFail() {
        System.out.println("Auth has failed");
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("result","fail");

        return ResponseEntity.ok(resultMap);
    }

    @RequestMapping("logOutSuccess")
    public ResponseEntity<Void> logOutSuccess(Authentication authentication) {
        System.out.println(authentication);
        System.out.println("log out success");

        return ResponseEntity.ok().build();
    }
}
