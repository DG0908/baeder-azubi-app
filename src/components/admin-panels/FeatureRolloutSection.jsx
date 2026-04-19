import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Rocket, RefreshCw, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { featureRolloutAdminApi } from '../../lib/api/features';
import { FEATURE_STAGES } from '../../lib/featureRegistry';

const STAGE_LABEL = {
  alpha: 'Alpha',
  beta: 'Beta',
  stable: 'Stable'
};

const STAGE_HINT = {
  alpha: 'Nur Admins',
  beta: 'Admins + Beta-Tester',
  stable: 'Alle mit passender Rolle'
};

const STAGE_BADGE_CLASS = {
  alpha: 'bg-red-100 text-red-700 border-red-200',
  beta: 'bg-amber-100 text-amber-700 border-amber-200',
  stable: 'bg-green-100 text-green-700 border-green-200'
};

const stageOrder = (stage) => {
  const index = FEATURE_STAGES.indexOf(stage);
  return index === -1 ? 99 : index;
};

const sortFeatures = (features) => {
  return [...features].sort((left, right) => {
    if (left.alwaysOn !== right.alwaysOn) return left.alwaysOn ? 1 : -1;
    const stageDiff = stageOrder(left.stage) - stageOrder(right.stage);
    if (stageDiff !== 0) return stageDiff;
    return left.label.localeCompare(right.label, 'de');
  });
};

const StageSwitch = ({ currentStage, disabled, onChange }) => (
  <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-xs" role="group">
    {FEATURE_STAGES.map((stage) => {
      const isActive = stage === currentStage;
      return (
        <button
          key={stage}
          type="button"
          disabled={disabled || isActive}
          onClick={() => onChange(stage)}
          className={`px-3 py-1.5 font-medium transition-colors ${
            isActive
              ? 'bg-cyan-600 text-white cursor-default'
              : disabled
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title={STAGE_HINT[stage]}
        >
          {STAGE_LABEL[stage]}
        </button>
      );
    })}
  </div>
);

export const FeatureRolloutSection = () => {
  const { showToast } = useApp();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin-feature-rollout'],
    queryFn: featureRolloutAdminApi.snapshot,
    enabled: isExpanded
  });

  const stageMutation = useMutation({
    mutationFn: ({ key, stage }) => featureRolloutAdminApi.setStage(key, stage),
    onSuccess: (_result, variables) => {
      showToast(`${variables.key}: Stufe auf ${STAGE_LABEL[variables.stage]} gesetzt`, 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-feature-rollout'] });
      queryClient.invalidateQueries({ queryKey: ['features-me'] });
    },
    onError: (err) => {
      showToast(`Stufen-Wechsel fehlgeschlagen: ${err?.message || 'Unbekannter Fehler'}`, 'error');
    }
  });

  const handleStageChange = (key, stage) => {
    if (stageMutation.isPending) return;
    stageMutation.mutate({ key, stage });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        aria-expanded={isExpanded}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-start gap-3">
          <Rocket className="text-cyan-600 mt-1" size={24} />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Feature-Freigabe</h3>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Steuert pro Bereich, wer ihn sehen darf. <strong>Alpha</strong> nur fuer Admins,
              <strong> Beta</strong> zusaetzlich fuer markierte Beta-Tester, <strong> Stable</strong> fuer alle mit passender Rolle.
            </p>
          </div>
        </div>
        <span className="flex-shrink-0 inline-flex items-center gap-1 text-sm text-gray-500">
          {isExpanded ? <>Einklappen <ChevronUp size={16} /></> : <>Ausklappen <ChevronDown size={16} /></>}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4">
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
              Aktualisieren
            </button>
          </div>

          {isLoading && (
            <div className="py-6 text-center text-sm text-gray-500">Features werden geladen...</div>
          )}

          {isError && (
            <div className="py-4 px-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              Fehler beim Laden: {error?.message || 'Unbekannter Fehler'}
            </div>
          )}

          {data && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="pb-2 pr-3 font-semibold">Bereich</th>
                <th className="pb-2 pr-3 font-semibold">Aktuelle Stufe</th>
                <th className="pb-2 pr-3 font-semibold">Rollen</th>
                <th className="pb-2 pr-3 font-semibold">Stufe wechseln</th>
              </tr>
            </thead>
            <tbody>
              {sortFeatures(data.features).map((feature) => {
                const disabled = feature.alwaysOn || stageMutation.isPending;
                const badgeClass = feature.alwaysOn
                  ? 'bg-gray-100 text-gray-700 border-gray-200'
                  : STAGE_BADGE_CLASS[feature.stage] || STAGE_BADGE_CLASS.stable;
                return (
                  <tr key={feature.key} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 pr-3 align-top">
                      <div className="font-medium text-gray-800">{feature.label}</div>
                      <div className="text-xs text-gray-500 font-mono">{feature.key}</div>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${badgeClass}`}>
                        {feature.alwaysOn ? <><Lock size={11} />Immer an</> : STAGE_LABEL[feature.stage] || feature.stage}
                      </span>
                      {!feature.alwaysOn && feature.stage !== feature.defaultStage && (
                        <div className="text-[10px] text-gray-400 mt-1">
                          Standard: {STAGE_LABEL[feature.defaultStage]}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <div className="flex flex-wrap gap-1">
                        {feature.requiredRoles.map((role) => (
                          <span key={role} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      {feature.alwaysOn ? (
                        <span className="text-xs text-gray-400 italic">nicht veraenderbar</span>
                      ) : (
                        <StageSwitch
                          currentStage={feature.stage}
                          disabled={disabled}
                          onChange={(next) => handleStageChange(feature.key, next)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default FeatureRolloutSection;
