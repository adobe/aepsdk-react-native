/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use it except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
*/
/**
 * CoreTurbo – Turbo Module that logs and returns Core/Optimize extension versions (AEP SDK from cloud).
 */
import NativeCoreTurbo from './NativeCoreTurbo';

export function getExtensionVersion(): Promise<string> {
  return NativeCoreTurbo.getExtensionVersion();
}

export function getOptimizeVersion(): Promise<string> {
  return NativeCoreTurbo.getOptimizeVersion();
}
