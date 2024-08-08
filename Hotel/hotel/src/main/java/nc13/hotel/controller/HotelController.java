package nc13.hotel.controller;


import nc13.hotel.model.HotelDTO;
import nc13.hotel.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/hotel/")
public class HotelController {
    private HotelService HOTEL_SERVICE;

    @Autowired
    public HotelController(HotelService hotelService) {
        HOTEL_SERVICE = hotelService;
    }

    @GetMapping("showOne/{id}")
    public HotelDTO selectOne(@PathVariable int id) {
        return HOTEL_SERVICE.selectOne(id);
    }

    @GetMapping("showList/{pageNo}")
    public HashMap<String, Object> selectList(Model model, @PathVariable int pageNo, @RequestParam(value = "searchType", required = false) String searchType,
                                              @RequestParam(value = "keyword", required = false) String keyword) {
        HashMap<String, Object> resultMap = new HashMap<>();

        int maxPage = HOTEL_SERVICE.selectMaxPage();

        int startPage = 1;
        int endPage = 1;

        if (maxPage < 5) {
            endPage = maxPage;
        } else if (pageNo <= 3) {
            endPage = 5;
        } else if (pageNo >= maxPage - 2) {
            startPage = maxPage - 4;
            endPage = maxPage;
        } else {
            startPage = pageNo - 2;
            endPage = pageNo + 2;
        }

        resultMap.put("currentPage", pageNo);
        resultMap.put("startPage", startPage);
        resultMap.put("endPage", endPage);
        resultMap.put("maxPage", maxPage);
        resultMap.put("hotelList", HOTEL_SERVICE.selectAll(pageNo));

        List<HotelDTO> list;
        if (searchType != null && keyword != null && !keyword.isEmpty()) {
            list = HOTEL_SERVICE.searchHotels(searchType, keyword);
            model.addAttribute("searchType", searchType);
            model.addAttribute("keyword", keyword);
        } else {
            list = HOTEL_SERVICE.selectAll(pageNo);
        }
        model.addAttribute("list", list);

        return resultMap;
    }

    @PostMapping("uploads")
    public Map<String, Object> uploadFiles(MultipartHttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        List<String> uploadPaths = new ArrayList<>();

        Iterator<String> fileNames = request.getFileNames();
        while (fileNames.hasNext()) {
            String fileName = fileNames.next();
            MultipartFile file = request.getFile(fileName);

            if (file != null && !file.isEmpty()) {
                String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
                String uploadName = UUID.randomUUID() + extension;

                String realPath = request.getServletContext().getRealPath("/hotel/uploads/");
                Path realDir = Paths.get(realPath);
                if (!Files.exists(realDir)) {
                    try {
                        Files.createDirectories(realDir);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                File uploadFile = new File(realPath + uploadName);
                try {
                    file.transferTo(uploadFile);
                    uploadPaths.add("/hotel/uploads/" + uploadName);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        resultMap.put("uploaded", true);
        resultMap.put("urls", uploadPaths);
        return resultMap;
    }


    @PostMapping("write")
    public HashMap<String, Object> write(@RequestBody HotelDTO hotelDTO) {
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            HOTEL_SERVICE.insert(hotelDTO);
            resultMap.put("result", "success");
            resultMap.put("resultId", hotelDTO.getId());
        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("result", "fail");
        }
        return resultMap;
    }

    @PostMapping("update")
    public HashMap<String, Object> update(@RequestBody HotelDTO hotelDTO) {
        System.out.println(hotelDTO);
        HashMap<String, Object> resultMap = new HashMap<>();
        HOTEL_SERVICE.update(hotelDTO);
        resultMap.put("destId", hotelDTO.getId());

        return resultMap;
    }

    @GetMapping("delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        HOTEL_SERVICE.delete(id);

        return ResponseEntity.ok().build();
    }
}
