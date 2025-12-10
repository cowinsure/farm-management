import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import UploadVideo from "@/helper/UploadVedio";
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
  showQrScan?: boolean;
  showMuzzleSearch?: boolean;
}

interface MuzzleResponse {
  geo_location: string;
  matched_id: string;
  msg: string;
  segmentation_image: string;
}

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzU2NTY5NiwianRpIjoiNzViZThkMjYtNGMwZC00YTc4LWEzM2ItMjAyODU4OGVkZmU4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3QiLCJuYmYiOjE3NDc1NjU2OTYsImNzcmYiOiI2Y2VjNWM1Mi0xMDJkLTRmYjUtOTE3NS1lNzZkZTBkMDM3YTYifQ.n5moEixJyO4eaXpYI8yG6Qnjf3jjBrWA7W19gW_4h8c";

const AssetSelection: React.FC<AssetSelectionProps> = ({
  value,
  onChange,
  onAssetSelect,
  label = "Asset",
  showQrScan = false,
  showMuzzleSearch = false,
}) => {
  const { t } = useLocalization();
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [muzzleResponse, setMuzzleResponse] = useState<MuzzleResponse | null>(
    null
  );
  const [isVideoSearchModalOpen, setIsVideoSearchModalOpen] = useState(false);

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

  const handleVideoUpload = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_AI}/claim`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.status === 200) {
        const data: MuzzleResponse = await response.json();
        setMuzzleResponse(data);
        const matchedAsset = assets.find(
          (a) => a.reference_id === data.matched_id
        );
        if (matchedAsset) {
          handleValueChange(String(matchedAsset.id));
          toast({
            title: "Success",
            description: `Asset ${matchedAsset.reference_id} found and selected`,
          });
        } else {
          toast({
            title: "Not Found",
            description: "No matching asset found for the muzzle video",
          });
        }
      } else if (response.status === 404) {
        const data = await response.json();
        setMuzzleResponse(data);
        toast({
          title: "Not Found",
          description: data.msg || "Asset not found",
        });
      } else {
        throw new Error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Error",
        description: "Something went wrong: " + error,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleQrScan = () => {
    // Placeholder for QR scan functionality
    toast({
      title: "QR Scan",
      description: "QR scan functionality to be implemented",
    });
  };

  return (
    <div>
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <Select
          value={value}
          onValueChange={handleValueChange}
          disabled={loadingAssets}
        >
          <SelectTrigger className="w-full h-16 px-1">
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
      {(showQrScan || showMuzzleSearch) && (
        <div className="flex items-center gap-2 mt-2">
          <small>or select with:</small>
          {showQrScan && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQrScan}
              className="flex items-center gap-2 border-green-600 text-green-700"
            >
              <QrCode className="h-4 w-4 " />
              {/* {t("scan_qr")} */} <span>QR scan</span>
            </Button>
          )}
          {showMuzzleSearch && (
            <Dialog
              open={isVideoSearchModalOpen}
              onOpenChange={setIsVideoSearchModalOpen}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-green-700 text-green-700"
                >
                  <Camera className="h-4 w-4" />
                  {/* {t("video_search")} */} <span>Video search</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Video Search</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <UploadVideo
                    onVideoCapture={(file) => {
                      console.log("Captured video file:", file);
                      setSelectedFile(file);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-green-700 text-green-700"
                    onClick={() => {
                      if (selectedFile) {
                        handleVideoUpload(selectedFile);
                        setIsVideoSearchModalOpen(false); // Close modal after upload
                      } else {
                        toast({
                          title: "No Video",
                          description: "Please select a video first",
                        });
                      }
                    }}
                    disabled={isUploading}
                  >
                    <Camera className="h-4 w-4" />
                    {/* {isUploading ? t("uploading") : t("search_muzzle")} */}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetSelection;
