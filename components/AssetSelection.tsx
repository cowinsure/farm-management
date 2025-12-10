import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalization } from "@/context/LocalizationContext";

interface Asset {
  id: number;
  name: string;
  reference_id: string;
  img: string;
  breed: string;
  age: number;
}

interface AssetSelectionProps {
  value?: string;
  onChange?: (value: string) => void;
  onAssetSelect?: (asset: Asset | null) => void;
  label?: string;
}

const AssetSelection: React.FC<AssetSelectionProps> = ({
  value,
  onChange,
  onAssetSelect,
  label = "Asset",
}) => {
  const { t } = useLocalization();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  useEffect(() => {
    setLoadingAssets(true);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/assets-service`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Assets data:", data);

        // Assume data.list or data.data.list
        const list = data?.data?.list || data?.list || [];
        setAssets(
          list.map((a: any) => ({
            id: a.id,
            name: a.name || a.asset_ref_id || `Asset ${a.id}`,
            reference_id: a.reference_id,
            img: a.image_with_owner,
            breed: a.breed,
            age: a.age_in_months,
          }))
        );
      })
      .catch(() => setAssets([]))
      .finally(() => setLoadingAssets(false));
  }, []);

  const handleValueChange = (v: string) => {
    onChange?.(v);
    const asset = assets.find((a) => String(a.id) === v) || null;
    onAssetSelect?.(asset);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={loadingAssets}
      >
        <SelectTrigger className="w-full h-20">
          <SelectValue
            placeholder={
              loadingAssets ? `${t("loading")}` : `${t("select_asset")}`
            }
          />
        </SelectTrigger>
        <SelectContent>
          {assets.map((a) => (
            <SelectItem
              key={a.id}
              value={String(a.id)}
              className="flex items-center gap-3"
            >
              <img
                className="w-12 h-12 inline-flex rounded-sm object-cover"
                src={`${process.env.NEXT_PUBLIC_API_BASE_IMAGE_URL}${a.img}`}
                alt=""
              />

              <span className="text-sm ml-3">
                <span className="font-semibold text-gray-900">
                  {a.reference_id}
                </span>
                {" | "}
                <span className="text-gray-700">{a.breed}</span>
                {" | "}
                <span className="text-gray-500">
                  <small>Age:</small> {a.age}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AssetSelection;