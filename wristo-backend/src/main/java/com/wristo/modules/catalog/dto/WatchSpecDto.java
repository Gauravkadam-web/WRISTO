package com.wristo.modules.catalog.dto;

import com.wristo.modules.catalog.entity.WatchSpec;

public class WatchSpecDto {

    private String caseDiameterMm;
    private String caseMaterial;
    private String dialFinish;
    private String strapMaterial;
    private String waterResistanceAtm;
    private String powerReserveHours;
    private String glassCrystal;
    private String claspType;
    private String warrantyPeriod;

    public WatchSpecDto() {
    }

    public static WatchSpecDto from(WatchSpec spec) {
        if (spec == null) return null;
        WatchSpecDto dto = new WatchSpecDto();
        dto.setCaseDiameterMm(spec.getCaseDiameterMm());
        dto.setCaseMaterial(spec.getCaseMaterial());
        dto.setDialFinish(spec.getDialFinish());
        dto.setStrapMaterial(spec.getStrapMaterial());
        dto.setWaterResistanceAtm(spec.getWaterResistanceAtm());
        dto.setPowerReserveHours(spec.getPowerReserveHours());
        dto.setGlassCrystal(spec.getGlassCrystal());
        dto.setClaspType(spec.getClaspType());
        dto.setWarrantyPeriod(spec.getWarrantyPeriod());
        return dto;
    }

    public String getCaseDiameterMm() { return caseDiameterMm; }
    public void setCaseDiameterMm(String caseDiameterMm) { this.caseDiameterMm = caseDiameterMm; }

    public String getCaseMaterial() { return caseMaterial; }
    public void setCaseMaterial(String caseMaterial) { this.caseMaterial = caseMaterial; }

    public String getDialFinish() { return dialFinish; }
    public void setDialFinish(String dialFinish) { this.dialFinish = dialFinish; }

    public String getStrapMaterial() { return strapMaterial; }
    public void setStrapMaterial(String strapMaterial) { this.strapMaterial = strapMaterial; }

    public String getWaterResistanceAtm() { return waterResistanceAtm; }
    public void setWaterResistanceAtm(String waterResistanceAtm) { this.waterResistanceAtm = waterResistanceAtm; }

    public String getPowerReserveHours() { return powerReserveHours; }
    public void setPowerReserveHours(String powerReserveHours) { this.powerReserveHours = powerReserveHours; }

    public String getGlassCrystal() { return glassCrystal; }
    public void setGlassCrystal(String glassCrystal) { this.glassCrystal = glassCrystal; }

    public String getClaspType() { return claspType; }
    public void setClaspType(String claspType) { this.claspType = claspType; }

    public String getWarrantyPeriod() { return warrantyPeriod; }
    public void setWarrantyPeriod(String warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; }
}
