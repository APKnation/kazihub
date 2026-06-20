package com.kazihub.apk.config;

import com.kazihub.apk.model.*;
import com.kazihub.apk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RegionRepository regionRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedAdminUser();
        seedTanzaniaLocations();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByPhone("0741019426")) {
            User admin = User.builder()
                    .name("Super Admin")
                    .phone("0741019426")
                    .email("admin@kazihub.com")
                    .password(passwordEncoder.encode("1234"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Default Admin user created. Phone: 0741019426 / Password: 1234");
        }
    }

    private void seedTanzaniaLocations() {
        if (regionRepository.count() > 0) {
            System.out.println("Location data already exists, skipping seeding.");
            return;
        }

        // Seed Regions
        Region darEsSalaam = regionRepository.save(Region.builder().name("Dar es Salaam").build());
        Region iringa = regionRepository.save(Region.builder().name("Iringa").build());
        Region arusha = regionRepository.save(Region.builder().name("Arusha").build());
        Region mwanza = regionRepository.save(Region.builder().name("Mwanza").build());
        Region dodoma = regionRepository.save(Region.builder().name("Dodoma").build());

        // Seed Districts for Dar es Salaam
        District ilala = districtRepository.save(District.builder().name("Ilala").region(darEsSalaam).build());
        District kinondoni = districtRepository.save(District.builder().name("Kinondoni").region(darEsSalaam).build());
        District temeke = districtRepository.save(District.builder().name("Temeke").region(darEsSalaam).build());

        // Seed Districts for Iringa
        District iringaMunicipal = districtRepository.save(District.builder().name("Iringa Municipal").region(iringa).build());
        District kilolo = districtRepository.save(District.builder().name("Kilolo").region(iringa).build());
        District mufindi = districtRepository.save(District.builder().name("Mufindi").region(iringa).build());

        // Seed Districts for Arusha
        District arushaMunicipal = districtRepository.save(District.builder().name("Arusha Municipal").region(arusha).build());
        District meru = districtRepository.save(District.builder().name("Meru").region(arusha).build());
        District karatu = districtRepository.save(District.builder().name("Karatu").region(arusha).build());

        // Seed Districts for Mwanza
        District mwanzaMunicipal = districtRepository.save(District.builder().name("Mwanza Municipal").region(mwanza).build());
        District misungwi = districtRepository.save(District.builder().name("Misungwi").region(mwanza).build());
        District kwimba = districtRepository.save(District.builder().name("Kwimba").region(mwanza).build());

        // Seed Districts for Dodoma
        District dodomaMunicipal = districtRepository.save(District.builder().name("Dodoma Municipal").region(dodoma).build());
        District kongwa = districtRepository.save(District.builder().name("Kongwa").region(dodoma).build());
        District chamwino = districtRepository.save(District.builder().name("Chamwino").region(dodoma).build());

        // Seed Wards for Ilala (Dar es Salaam)
        wardRepository.save(Ward.builder().name("Gerezani").district(ilala).build());
        wardRepository.save(Ward.builder().name("Kariakoo").district(ilala).build());
        wardRepository.save(Ward.builder().name("Ilala").district(ilala).build());
        wardRepository.save(Ward.builder().name("Segerea").district(ilala).build());
        wardRepository.save(Ward.builder().name("Vigogo").district(ilala).build());

        // Seed Wards for Kinondoni (Dar es Salaam)
        wardRepository.save(Ward.builder().name("Masaki").district(kinondoni).build());
        wardRepository.save(Ward.builder().name("Oysterbay").district(kinondoni).build());
        wardRepository.save(Ward.builder().name("Makumbusho").district(kinondoni).build());
        wardRepository.save(Ward.builder().name("Kijitonyama").district(kinondoni).build());
        wardRepository.save(Ward.builder().name("Mwenge").district(kinondoni).build());

        // Seed Wards for Temeke (Dar es Salaam)
        wardRepository.save(Ward.builder().name("Temeke").district(temeke).build());
        wardRepository.save(Ward.builder().name("Chang'ombe").district(temeke).build());
        wardRepository.save(Ward.builder().name("Mbagala").district(temeke).build());
        wardRepository.save(Ward.builder().name("Kijichi").district(temeke).build());
        wardRepository.save(Ward.builder().name("Mtoni").district(temeke).build());

        // Seed Wards for Iringa Municipal
        wardRepository.save(Ward.builder().name("Mkwawa").district(iringaMunicipal).build());
        wardRepository.save(Ward.builder().name("Mhalala").district(iringaMunicipal).build());
        wardRepository.save(Ward.builder().name("Ilala Mpya").district(iringaMunicipal).build());
        wardRepository.save(Ward.builder().name("Kihesa").district(iringaMunicipal).build());
        wardRepository.save(Ward.builder().name("Mafinga").district(iringaMunicipal).build());

        // Seed Wards for Kilolo
        wardRepository.save(Ward.builder().name("Kilolo").district(kilolo).build());
        wardRepository.save(Ward.builder().name("Lupembwe").district(kilolo).build());
        wardRepository.save(Ward.builder().name("Mlandizi").district(kilolo).build());

        // Seed Wards for Arusha Municipal
        wardRepository.save(Ward.builder().name("Soweto").district(arushaMunicipal).build());
        wardRepository.save(Ward.builder().name("Eliat").district(arushaMunicipal).build());
        wardRepository.save(Ward.builder().name("Kijenge").district(arushaMunicipal).build());
        wardRepository.save(Ward.builder().name("Njiro").district(arushaMunicipal).build());
        wardRepository.save(Ward.builder().name("Sekei").district(arushaMunicipal).build());

        // Seed Wards for Mwanza Municipal
        wardRepository.save(Ward.builder().name("Nyamagana").district(mwanzaMunicipal).build());
        wardRepository.save(Ward.builder().name("Kapri Point").district(mwanzaMunicipal).build());
        wardRepository.save(Ward.builder().name("Mabatini").district(mwanzaMunicipal).build());
        wardRepository.save(Ward.builder().name("Igogo").district(mwanzaMunicipal).build());
        wardRepository.save(Ward.builder().name("Isamilo").district(mwanzaMunicipal).build());

        // Seed Wards for Dodoma Municipal
        wardRepository.save(Ward.builder().name("Majengo").district(dodomaMunicipal).build());
        wardRepository.save(Ward.builder().name("Madukani").district(dodomaMunicipal).build());
        wardRepository.save(Ward.builder().name("Huduma").district(dodomaMunicipal).build());
        wardRepository.save(Ward.builder().name("Msalato").district(dodomaMunicipal).build());
        wardRepository.save(Ward.builder().name("Mkonze").district(dodomaMunicipal).build());

        System.out.println("Tanzania location data seeded successfully!");
    }
}
