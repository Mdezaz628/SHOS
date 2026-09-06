import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Activity,
  AlertOctagon,
  BedDouble
} from 'lucide-react';
import { Badge } from './Badge';

export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  if (
    normalized.includes('active') ||
    normalized.includes('admitted') ||
    normalized.includes('optimal') ||
    normalized.includes('ready') ||
    normalized.includes('completed') ||
    normalized.includes('approved')
  ) {
    return (
      <Badge variant="success" icon={CheckCircle2} className={className}>
        {status}
      </Badge>
    );
  }

  if (
    normalized.includes('waiting') ||
    normalized.includes('pending') ||
    normalized.includes('processing') ||
    normalized.includes('low') ||
    normalized.includes('guarded') ||
    normalized.includes('moderate')
  ) {
    return (
      <Badge variant="warning" icon={Clock} className={className}>
        {status}
      </Badge>
    );
  }

  if (
    normalized.includes('critical') ||
    normalized.includes('emergency') ||
    normalized.includes('stat') ||
    normalized.includes('occupied') ||
    normalized.includes('rejected') ||
    normalized.includes('severe')
  ) {
    return (
      <Badge variant="critical" icon={AlertOctagon} className={`${className} pulse-critical`}>
        {status}
      </Badge>
    );
  }

  if (normalized.includes('available') || normalized.includes('sanitized')) {
    return (
      <Badge variant="secondary" icon={BedDouble} className={className}>
        {status}
      </Badge>
    );
  }

  return <Badge variant="neutral" className={className}>{status}</Badge>;
};
