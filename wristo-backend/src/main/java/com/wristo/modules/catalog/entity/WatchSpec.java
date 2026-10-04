package com.wristo.modules.catalog.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wristo.common.entity.BaseAuditEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "watch_specs")
public class WatchSpec extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watch_id", nullable = false, unique = true)
    private Watch watch;

    @Column(name = "case_diameter_mm", length = 32, nullable = false)
    private String caseDiameterMm;

    @Column(name = "case_material", length = 64, nullable = false)
    private String caseMaterial;

    @Column(name = "dial_finish", length = 64, nullable = false)
    private String dialFinish;

    @Column(name = "strap_material", length = 64, nullable = false)
    private String strapMaterial;

    @Column(name = "water_resistance_atm", length = 32, nullable = false)
    private String waterResistanceAtm;

    @Column(name = "power_reserve_hours", length = 32)
    private String powerReserveHours;

    @Column(name = "glass_crystal", length = 64, nullable = false)
    private String glassCrystal = "Sapphire Crystal (Anti-Reflective)";

    @Column(name = "clasp_type", length = 64, nullable = false)
    private String claspType = "Deployant Safety Clasp";

    @Column(name = "warranty_period", length = 64, nullable = false)
    private String warrantyPeriod = "2-Year International Warranty";

    public WatchSpec() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Watch getWatch() {
        return watch;
    }

    public void setWatch(Watch watch) {
        this.watch = watch;
    }

    public String getCaseDiameterMm() {
        return caseDiameterMm;
    }

    public void setCaseDiameterMm(String caseDiameterMm) {
        this.caseDiameterMm = caseDiameterMm;
    }

    public String getCaseMaterial() {
        return caseMaterial;
    }

    public void setCaseMaterial(String caseMaterial) {
        this.caseMaterial = caseMaterial;
    }

    public String getDialFinish() {
        return dialFinish;
    }

    public void setDialFinish(String dialFinish) {
        this.dialFinish = dialFinish;
    }

    public String getStrapMaterial() {
        return strapMaterial;
    }

    public void setStrapMaterial(String strapMaterial) {
        this.strapMaterial = strapMaterial;
    }

    public String getWaterResistanceAtm() {
        return waterResistanceAtm;
    }

    public void setWaterResistanceAtm(String waterResistanceAtm) {
        this.waterResistanceAtm = waterResistanceAtm;
    }

    public String getPowerReserveHours() {
        return powerReserveHours;
    }

    public void setPowerReserveHours(String powerReserveHours) {
        this.powerReserveHours = powerReserveHours;
    }

    public String getGlassCrystal() {
        return glassCrystal;
    }

    public void setGlassCrystal(String glassCrystal) {
        this.glassCrystal = glassCrystal;
    }

    public String getClaspType() {
        return claspType;
    }

    public void setClaspType(String claspType) {
        this.claspType = claspType;
    }

    public String getWarrantyPeriod() {
        return warrantyPeriod;
    }

    public void setWarrantyPeriod(String warrantyPeriod) {
        this.warrantyPeriod = warrantyPeriod;
    }
}
