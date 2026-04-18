const fs = require('fs');
const path = require('path');

const filePath = '/Users/adedotungabriel/work/me/mls/mls-client/app/app/shipments/new/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Imports
content = content.replace(
  'import ServiceSelection from "@/components/shipment/service-selection";',
  'import ServiceSelection from "@/components/shipment/service-selection";\nimport CustomsForm from "@/components/shipment/customs-form";'
);
content = content.replace(
  'import { FiMapPin, FiPackage, FiTruck, FiCheckCircle } from "react-icons/fi";',
  'import { FiMapPin, FiPackage, FiTruck, FiCheckCircle, FiClipboard } from "react-icons/fi";'
);

// 2. State extract
content = content.replace(
  /addPackage,\n\s*updatePackage,\n\s*selectedRate,\n\s*setSelectedRate,\n\s*\} = useShipmentStore\(\);/,
  `addPackage,
    updatePackage,
    customs,
    setCustoms,
    selectedRate,
    setSelectedRate,
  } = useShipmentStore();

  const isInternational = sender?.country && recipient?.country && sender.country !== recipient.country;`
);

// 3. fetch rates useEffect
content = content.replace(
  /countryCode \|\| undefined,\n\s*\);/,
  `countryCode || undefined,
        customs || undefined,
      );`
);
content = content.replace(
  /getRates,\n\s*countryCode,\n\s*\]\);/,
  `getRates,
    countryCode,
    customs,
  ]);`
);


// 4. steps & isSectionVisible
const oldSteps = `  const steps: TimelineStep\\[\\] = useMemo\\([\\s\\S]*?return false;\n  };`;
content = content.replace(new RegExp(oldSteps), `  const steps: TimelineStep[] = useMemo(() => {
    const arr: TimelineStep[] = [
      {
        id: "pickup",
        label: "Pick-up Details",
        status: expandedSection === "pickup" ? "current" : completedSteps.includes("pickup") ? "completed" : "pending",
      },
      {
        id: "dropoff",
        label: "Drop-off Details",
        status: expandedSection === "dropoff" ? "current" : completedSteps.includes("dropoff") ? "completed" : "pending",
      },
      {
        id: "package",
        label: "Package Details",
        status: expandedSection === "package" ? "current" : completedSteps.includes("package") ? "completed" : "pending",
      },
    ];

    if (isInternational) {
      arr.push({
        id: "customs",
        label: "Customs Details",
        status: expandedSection === "customs" ? "current" : completedSteps.includes("customs") ? "completed" : "pending",
      });
    }

    arr.push({
      id: "service",
      label: "Service Selection",
      status: expandedSection === "service" ? "current" : completedSteps.includes("service") ? "completed" : "pending",
    });

    return arr;
  }, [expandedSection, completedSteps, isInternational]);

  const isSectionVisible = (id: string) => {
    if (id === "pickup") return true;
    if (id === "dropoff") return completedSteps.includes("pickup");
    if (id === "package") return completedSteps.includes("dropoff");
    if (id === "customs") return git add . && git commit -m "feat(shipments): split quote and estimate endpoints, enforce strict DHL customs schema"isInternational && completedSteps.includes("package");
    if (id === "service") return isInternational ? completedSteps.includes("customs") : completedSteps.includes("package");
    return false;
  };`);

// 5. handlePackageSubmit & handleCustomsSubmit
content = content.replace(
  /markSectionCompleted\("package"\);\n\s*setRates\(\[\]\); \/\/ Clear previous rates to trigger re-fetch in useEffect\n\s*setExpandedSection\("service"\);\n\n\s*addToast\(\{\n\s*title: "Success",\n\s*message: "Package details confirmed.",\n\s*type: "success",\n\s*\}\);\n\s*document\n\s*\.getElementById\("service"\)\n\s*\?\.scrollIntoView\(\{ behavior: "smooth", block: "center" \}\);\n\s*\};/,
  `markSectionCompleted("package");
    setRates([]); // Clear previous rates to trigger re-fetch in useEffect
    
    if (isInternational) {
      setExpandedSection("customs");
    } else {
      setExpandedSection("service");
    }

    addToast({
      title: "Success",
      message: "Package details confirmed.",
      type: "success",
    });
    document
      .getElementById(isInternational ? "customs" : "service")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCustomsSubmit = (data: any) => {
    setCustoms(data);
    markSectionCompleted("customs");
    setRates([]); // Clear previous rates
    setExpandedSection("service");

    addToast({
      title: "Success",
      message: "Customs details confirmed.",
      type: "success",
    });
    document
      .getElementById("service")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };`
);


// 6. finalize
content = content.replace(
  /if \(\!sender \|\| \!recipient \|\| \!packages\[0\] \|\| \!selectedRate\) \{/,
  `if (!sender || !recipient || !packages[0] || !selectedRate || (isInternational && !customs)) {`
);

content = content.replace(
  /customs: \{\n\s*contentsDescription: packages\[0\]\.description,\n\s*declaredValue: packages\[0\]\.value,\n\s*currency: packages\[0\]\.currency,\n\s*\}/,
  `customs: isInternational ? customs : undefined`
);

// 7. Render stacked section
content = content.replace(
  /\{\/\* 4\. Service Selection \*\/\}/g,
  `{/* 3.5 Customs Details */}
        {isSectionVisible("customs") && (
          <StackedSection
            id="customs"
            title="Customs Details"
            icon={<FiClipboard className="w-5 h-5" />}
            isExpanded={expandedSection === "customs"}
            isCompleted={completedSteps.includes("customs")}
            onEdit={() => setExpandedSection("customs")}
            summary={
              customs && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                    Declaration Type
                  </p>
                  <p className="font-bold text-gray-900 leading-tight">
                    {customs.customsType === "S" ? "Business" : "Individual"} - {customs.customsItem?.length} items
                  </p>
                </div>
              )
            }
          >
            <CustomsForm
              initialValues={customs}
              onSubmit={handleCustomsSubmit}
              onBack={() => setExpandedSection("package")}
            />
          </StackedSection>
        )}

        {/* 4. Service Selection */}`
);


fs.writeFileSync(filePath, content);
console.log("Patch applied correctly.");
